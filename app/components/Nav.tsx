import Link from 'next/link';

const Nav: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Resume Builder Toolbox</h1>
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">Builder</Link>
          <Link href="/toolbox" className="hover:underline">Toolbox</Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;