export default function LoadingScreen() {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl">로딩 중...</p>
          <div className="mt-4 w-12 h-12 border-t-4 border-green-400 border-solid rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  