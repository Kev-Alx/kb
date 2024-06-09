import Board from "../components/Board";
import { Toaster } from "../components/ui/toaster";
function App() {
  return (
    <>
      <main className="w-full flex px-8">
        <div className="mx-auto">
          <Board />
          <Toaster />
        </div>
      </main>
    </>
  );
}

export default App;
