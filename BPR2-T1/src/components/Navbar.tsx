import bell from "../../public/bell.png";

interface Props  {
  title: string
}

const Navbar: React.FC<Props> = (props) => {
  return (
    <div className="sticky top-0 z-10 bg-white shadow-md flex w-full p-4 items-center">
      <h1 className="text-3xl text-blue-500 font-semibold">
        {props.title}
      </h1>

      <div className="flex flex-1 justify-end items-center mr-10">
        <input
          type="text"
          className="bg-red-100 rounded-xl border border-slate-200 p-1 ml-2"
          placeholder="Search for a user"
        />

        <div className="relative ml-6 mb-10">
          <div className="absolute w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <img src={bell} alt="Bell Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
