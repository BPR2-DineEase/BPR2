interface Props {
  title: string;
}

const Navbar: React.FC<Props> = (props) => {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-md flex justify-center w-full p-4 items-center">
      <h1 className="text-3xl text-blue-500 font-semibold">{props.title}</h1>
    </div>
  );
};

export default Navbar;
