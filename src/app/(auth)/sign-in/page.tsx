'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"

function page() {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('') //to save message with username recieved from backend, if any
  const [isCheckingUsername, setIsCheckingUsername] = useState(false) //loading state while checking for any username message from the backend
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 300) //we are doing this so that the username request is sent after a delay to avoid continuous requests to the DB
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username : '',
      email : '',
      password : ''
    }
  })

  useEffect(() => {

  }, [debouncedUsername])

  return (
    <div>page</div>
  )
}

export default page