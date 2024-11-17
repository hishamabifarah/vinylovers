import AddVinylForm from "./AddVinylForm";

export default function Page() {
  return (
    <main className="flex h-screen p-5 w-full">
      <div className="flex h-full max-h-[40rem]  w-full overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10">
          <h1 className="text-center text-3xl font-bold">Add New Vinyl</h1>
          <div className="space-y-5">
            <AddVinylForm />
          </div>
        </div>
      </div>
    </main>
  );
}
