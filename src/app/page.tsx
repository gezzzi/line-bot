export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">LINE Bot</h1>
        <p className="text-gray-600 dark:text-gray-300">
          このボットはLINEアプリ上で動作します。
        </p>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          <a
            href="https://line.me/R/ti/p/@025hxdqc"
            className="text-blue-500 hover:text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINEの友達登録はこちらから
          </a>
        </p>
      </div>
    </main>
  )
}
