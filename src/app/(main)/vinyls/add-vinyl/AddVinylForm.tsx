'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import LoadingButton from '@/components/LoadingButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition , useEffect} from "react";

import { submitVinyl } from "./actions";
import { useSubmitVinylMutation } from "./mutations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vinylSchema = z.object({
  artist: z.string().min(1, "Artist is required"),
  album: z.string().min(1, "Album is required"),
  genreId: z.string().min(1, "Genre is required"),
})

type NewVinylValues = z.infer<typeof vinylSchema>


interface Genre {
  id: string;
  name: string;
}

interface AddVinylFormProps {
  genres: Genre[]
}

export default function AddVinylForm({ genres }: AddVinylFormProps) {

  const mutation = useSubmitVinylMutation();

  const form = useForm<NewVinylValues>({
    resolver: zodResolver(vinylSchema),
    defaultValues: {
      artist: '',
      album: '',
      genreId: '',
    },
  })

  const onSubmit = (values: NewVinylValues) => {
    console.log('Submit function called', values);
    mutation.mutate(values)
    // We're not calling the mutation here to isolate the form submission
  }

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artist</FormLabel>
              <FormControl>
                <Input placeholder="Artist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="album"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Album Title</FormLabel>
              <FormControl>
                <Input placeholder="Album Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
          {/* genre and subgenre */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="genreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map((genre) => (
                          <SelectItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Genre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        </div>
        <LoadingButton loading={mutation.isPending} type="submit" className="w-full">
          Add Vinyl
        </LoadingButton>
      </form>
    </Form>
  )
}

