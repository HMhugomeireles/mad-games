'use client';

import Link from "next/link";
import { TertiaryButton } from "../public-components/ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { TacticalInput } from "../ui/input";

const Schema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required").trim()
});

export default function RecoverAccount() {

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  type FormValues = z.infer<typeof Schema>;

  const onSubmit = async (values: FormValues) => { }

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
            Recovery account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TacticalInput
                      type="email"
                      placeholder="Email"
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
                Recover
              </button>

            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}