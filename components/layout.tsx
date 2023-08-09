export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (<>
          <h1>Root Layout</h1>
          {children}
        </>
  )
}
