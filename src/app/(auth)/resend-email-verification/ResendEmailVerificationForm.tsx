"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  resendVerificationEmailSchema, ResendVerifcationEmailValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { verify } from "./actions";

export default function ResetPasswordEmailForm() {
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<ResendVerifcationEmailValues>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ResendVerifcationEmailValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await verify(values.email);
      if (error) setError(error);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {error && <p className="text-center text-destructive">{error}</p>}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full text-white">
          Resend Email
        </LoadingButton>
      </form>
    </Form>
  );
}