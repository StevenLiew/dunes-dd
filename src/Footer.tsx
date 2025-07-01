export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 mt-12 py-6 text-center text-sm text-gray-400">
      All intellectual property and assets related to Dune Awakening game are
      reserved by{" "}
      <a
        href="https://www.funcom.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-orange-400 hover:text-orange-300"
      >
        Funcom
      </a>{" "}
      and{" "}
      <a
        href="https://www.legendary.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-orange-400 hover:text-orange-300"
      >
        Legendary
      </a>
      . This site is fan-made and not affiliated with Dune Awakening game,
      Funcom or Legendary.
    </footer>
  );
}
