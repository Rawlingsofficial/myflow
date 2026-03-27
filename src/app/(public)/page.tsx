export default function PublicLandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold">Find Your Next Home</h1>
      <input
        type="text"
        placeholder="Search by city, address, or ZIP"
        className="mt-4 p-2 border rounded w-full max-w-md"
      />
      {/* Later: display search results or featured listings */}
    </div>
  );
}