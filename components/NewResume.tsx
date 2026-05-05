'use client'
import React, { useState } from 'react'
import { FileUploadComponent } from './FileUpload'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export async function previousResume(formData: FormData) {
  const userId = formData.get("userId")
  const jobId = formData.get("jobId")
  
  // Process the data, e.g., save it in a database
  console.log("User ID:", userId)
  console.log("Job ID:", jobId)
  console.log("formData:", formData)
  return { success: true }

}

const NewResume = ({ userId, jobId }: { userId: string; jobId: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)
      const formData = new FormData(e.currentTarget)
  
      try {
        const response = await previousResume(formData)
        if (response.success) {
          toast.success("Submission Successful!")
          // Redirect after a short delay to allow the toast to be seen
          setTimeout(() => {
            router.push("/jobs")
          }, 2000)
        } else {
          toast.error("Submission Unsuccessful!")
        }
      } catch (error) {
        toast.error("An error occurred!")
        console.error("Submission error:", error)
      }
      setIsSubmitting(false)
    }

  return (
    <>
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="jobId" value={jobId} />
      <FileUploadComponent />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full transform rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 px-3 py-2 text-xs font-medium text-white transition hover:scale-[1.02] hover:shadow-lg sm:px-4 sm:py-2.5 sm:text-sm"
        >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
    <ToastContainer 
            theme="dark" // This applies a dark theme (black background)
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
    </>
  )
}

export default NewResume
