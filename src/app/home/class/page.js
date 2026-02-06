export default function Class() {
  return (
    <div className="p-10 w-full max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-wrap md:flex-nowrap gap-6 w-full">
        {["Class Size", "High Risk Students", "Medium Risk Students", "Low Risk Students"].map((title) => (
          <div key={title} className="flex-1 min-w-[200px] bg-pink-300 rounded-2xl p-4 text-center shadow-md flex flex-col justify-center min-h-[120px]">
            <h2 className="font-semibold">{title}</h2>
          </div>
        ))}
      </div>

      <div className="bg-pink-300 w-full min-h-[160px] rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Risk Distribution</h2>
      </div>

      <div className="bg-pink-300 w-full min-h-[160px] rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-4">Class Learning Personas </h2>
      </div>

    </div>
  );
}