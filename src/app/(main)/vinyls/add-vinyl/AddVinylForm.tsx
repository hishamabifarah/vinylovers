// "use client";

// import LoadingButton from "@/components/LoadingButton";
// import NavbarDefault from "@/components/navigation/NavbarDefault";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { newVinylSchema, NewVinylValues } from "@/lib/validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState, useTransition , useEffect} from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// // import { login } from "./actions";

// import { useSubmitVinylMutation } from "./mutations";

// interface VinylFormInputs {
//   artist: string;
//   albumTitle: string;
//   genre: string;
//   subgenre: string;
//   releaseYear: number;
//   condition: string;
//   notes: string;
//   image: FileList;
//   genreId: string;
// }

// interface Genre {
//   id: string;
//   name: string;
// }

// export default function AddVinylForm() {
//   const [error, setError] = useState<string>();

//   const [isPending, startTransition] = useTransition();

//   const mutation = useSubmitVinylMutation();

//   const {
//     formState: { errors },
//     setValue 
//   } = useForm<VinylFormInputs>();

//   const [genres, setGenres] = useState<Genre[]>([]);

//   useEffect(() => {
//     const loadGenres = async () => {
//       const fetchedGenres = await fetchGenres();
//       setGenres(fetchedGenres);
//     };
//     loadGenres();
//   }, []);

//   const form = useForm<NewVinylValues>({
//     resolver: zodResolver(newVinylSchema),    
//     defaultValues: {
//       artist: "",
//       album: "",
//       genre: "",
//     },
//   });
  
//   const { register, handleSubmit, watch } = useForm<VinylFormInputs>()


//   // async function onSubmit(values: NewVinylValues) {
//   //   console.log('values', values)
//   //   mutation.mutate(
//   //     {

//   //         artist: values.artist,
//   //         album: values.album,
//   //         genre: values.genre,
//   //       },
      
//   //     {
//   //       onSuccess: () => {
//   //         console.log("Vinyl added");
//   //       },
//   //     },
//   //   );
//   // }

//   const fetchGenres = async (): Promise<Genre[]> => {
//     // Simulating an API call
//     return [
//       { id: "1", name: "Rock" },
//       { id: "2", name: "Jazz" },
//       { id: "3", name: "Electronic" },
//       { id: "4", name: "Hip Hop" },
//       { id: "5", name: "Classical" },
//     ];
//   };

//   const onSubmit: SubmitHandler<NewVinylValues> = (NewVinylValues) => {
//     mutation.mutate(
//       {

//           artist: NewVinylValues.artist,
//           album: NewVinylValues.album,
//           genre: NewVinylValues.genre,
//         },
      
//       {
//         onSuccess: () => {
//           console.log("Vinyl added");
//         },
//       },
//     );
//   }

//   return (
//     <>
//       <NavbarDefault />
//       <Form {...form}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//           {/* Artist and album Name */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             {error && <p className="text-center text-destructive">{error}</p>}
//             <FormField
//               control={form.control}
//               name="artist"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Artist</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Artist" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="album"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Album Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Album Title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* genre and subgenre */}
//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           {errors.genreId && <p className="text-red-500 text-sm mt-1">{errors.genreId.message}</p>}
//             <FormField
//               control={form.control}
//               name="artist"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Genre</FormLabel>
//                   <FormControl>
//                     <Select
//                       onValueChange={(value) => setValue("genreId", value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select genre" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {genres.map((genre) => (
//                           <SelectItem key={genre.id} value={genre.id}>
//                             {genre.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* <FormField
//               control={form.control}
//               name="subgenre"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Subgenre</FormLabel>
//                   <FormControl>
//                     <PasswordInput placeholder="Subgenre" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             /> */}
//           </div>

//           <LoadingButton
//              loading={mutation.isPending}
//             type="submit"
//             className="w-full text-white"
//           >
//             Add Vinyl
//           </LoadingButton>
//         </form>
//       </Form>
//     </>
//   );
// }

export  default function Page(){
  return(
    <h1>Add Vinyl</h1>
  )
}