import { useDebugStore } from '../store/debug';

export default function Debug() {
  const { target } = useDebugStore();

  return (
    <div className="fixed z-10 w-full h-screen pointer-events-none">
      <div className="inline-block p-4 m-4 text-gray-200 bg-gray-800 rounded-lg">
        target: [{target.x}, {target.y}]
      </div>
    </div>
  );
}
