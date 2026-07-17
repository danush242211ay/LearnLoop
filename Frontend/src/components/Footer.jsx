import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <Logo />
        <p className="font-mono text-xs text-faint">
          Learn → Build → Ship → Repeat.
        </p>
      </div>
    </footer>
  )
}
