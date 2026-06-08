
const API_URL = process.env.NEXT_PUBLIC_API_URL;


export function useApiClient() {
  const apiFetch = async (
    url: string,
    options: RequestInit = {}
  ) => {
    return fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  };

  return { apiFetch };
}


function pdfBase64ToUrl(pdfBase64: string): string {
  const binary = atob(pdfBase64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], {
    type: "application/pdf",
  });

  return URL.createObjectURL(blob);
}


async function compilePDFToBase64(
  reader: ReadableStreamDefaultReader<Uint8Array>
): Promise<string | undefined> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const event of events) {
      const dataLine = event
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!dataLine) continue;

      const payload = JSON.parse(
        dataLine.replace("data: ", "")
      );

      if (payload.latex) {
        localStorage.setItem(
          "cvLatexCode",
          payload.latex
        );
      }

      if (payload.pdf_base64) {
        return pdfBase64ToUrl(payload.pdf_base64);
      }
    }
  }
}

export async function generateResumePDFUrl(
  session_id: string,
  token: string | null
): Promise<string | undefined> {
  try {

    const response = await fetch(
      `${API_URL}/generate/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id }),
      }
    );

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is empty");
    }

    return compilePDFToBase64(reader);

  } catch (error) {
    console.error(error);
    throw error;
  }
}



export async function compileLaTeX(
  latex: string, 
  token: string | null
): Promise<Blob> {

  const response = await fetch(
    `${API_URL}/generate/compile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latex,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.detail || "Compilation failed"
    );
  }

  const { pdf_base64 } = await response.json();

  const binary = atob(pdf_base64);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: "application/pdf",
  });
}