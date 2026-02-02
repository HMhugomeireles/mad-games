'use client';

import { authClient } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import { TertiaryButton } from "../public-components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { TacticalInput } from "../ui/input";
import { toast } from "sonner";

const Schema = z.object({
  username: z.string().min(1, "Username is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

export default function Login() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onBlur",
  });

  type FormValues = z.infer<typeof Schema>;

  const onSubmit = async (values: FormValues) => {
    await authClient.signIn.email({
      email: values.username,
      password: values.password,
    }, {
      onSuccess: () => {
        router.push("/"); // Redireciona após login
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      }
    });
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Contentor Principal */}
      <div className="z-10 w-full max-w-md p-8 relative">

        {/* Decoração Tática (Linhas finas à volta do container) */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10"></div>

        {/* LOGO */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold tracking-widest text-white uppercase drop-shadow-lg">
            Mad games
          </h1>
          <p className="text-bullet-muted text-sm tracking-[0.4em] uppercase ml-1">
            User area
          </p>
        </div>

        <div className=''>
          <TertiaryButton
            onClick={handleGoogleSignIn}
          >
            <div className="flex items-center justify-center rounded-sm">
              <svg
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 mr-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 8.213-3.307 2.187-2.187 2.813-5.493 2.813-8.24 0-.587-.067-1.12-.173-1.533H12.48z" />
              </svg>
              google
            </div>
          </TertiaryButton>
        </div>

        <div className="mb-10 w-full h-8 border-b border-white/10"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TacticalInput
                      type="text"
                      placeholder="Username"
                      icon={
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TacticalInput
                      type="password"
                      placeholder="Password"
                      icon={
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />

            {/* Botão de Login e Link */}
            <div className="flex items-center gap-6 pt-4">
              <button
                type="submit"
                className="
                bg-gradient-to-b from-orange-500 to-bullet-accent 
                hover:from-orange-400 hover:to-orange-500
                text-white font-bold py-2 px-8 
                uppercase tracking-widest text-sm
                glow-orange clip-military
                transform hover:scale-105 transition-all duration-200
                border-t border-orange-400/50
              "
              >
                Login
              </button>

              <Link href="/forgot-password" className="text-xs text-bullet-accent hover:text-white transition-colors uppercase tracking-wide">
                Forgot your Password?
              </Link>
              <Link href="/sign-in" className="text-xs text-bullet-accent hover:text-white transition-colors uppercase tracking-wide">
                Register
              </Link>
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}