import React, { useEffect, useState } from "react";
import DarkModeDatepicker from "./DatePicker";
// import SearchInput from "./SearchInput";
import axios from "axios";
import toast from "react-hot-toast";

import { Event } from "../../homepage/index";

interface DateRangeState {
  startDate: string;
  endDate: string;
}
interface Category {
  id: number;
  name: string;
}

type props = {
  searched: boolean;
  setSearched: React.Dispatch<React.SetStateAction<boolean>>;
  searchedEvents: Event[];
  setSearchedEvents: React.Dispatch<React.SetStateAction<Event[]>>;
};

const SearchBar: React.FC<props> = ({
  searched,
  setSearched,
  searchedEvents,
  setSearchedEvents,
}) => {
  const [value, setValue] = useState<DateRangeState>({
    startDate: "",
    endDate: "",
  });
  // const applySearchFilter =()=>{

  // }

  // const handleValueChange = (newValue: DateRangeState) => {
  //   const initialDatetime = newValue.startDate
  //     ? new Date(newValue.startDate).toISOString()
  //     : new Date().toISOString();

  //   let initialDatetime2;
  //   if (newValue.endDate) {
  //     initialDatetime2 = new Date(newValue.endDate);
  //   } else {
  //     // Set the end date to 12 months from now
  //     initialDatetime2 = new Date();
  //     initialDatetime2.setMonth(initialDatetime2.getMonth() + 12);
  //   }

  //   // Set the time to 23:59 if endDate is not empty
  //   if (newValue.endDate) {
  //     initialDatetime2.setHours(23);
  //     initialDatetime2.setMinutes(59);
  //   }

  //   // Set the time to 23:59
  //   initialDatetime2.setHours(23);
  //   initialDatetime2.setMinutes(59);
  //   const endDateNew = initialDatetime2.toISOString();
  //   console.log(initialDatetime2.toISOString());
  //   console.log("newValue:", newValue);
  //   setValue({
  //     startDate: initialDatetime,
  //     endDate: endDateNew,
  //   });
  //   setSearched(true);
  // };

  const handleValueChange = (newValue: DateRangeState) => {
    const initialDatetime = newValue.startDate
      ? new Date(newValue.startDate).toISOString()
      : new Date().toISOString();

    let endDateNew = "";
    if (newValue.endDate) {
      endDateNew = new Date(newValue.endDate).toISOString();
    }

    setValue({
      startDate: initialDatetime,
      endDate: endDateNew,
    });
    setSearched(true);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      // Make a GET request to fetch categories from the backend
      const response = await axios.get<Category[]>(
        "http://localhost:5000/api/v1/category"
      );

      console.log(response.data);

      // Set the fetched categories in the state
      setCategories(response.data);

      console.log("============categories======");
      console.log(categories);

      console.log("=========categories==============");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response && error.response.data) {
          // Handle specific error messages from backend
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          // Other errors
          toast.error("An error occurred");
        }
      } else {
        // Handle non-Axios errors
        toast.error("An error occurred");
        console.error("An error occurred:", error);
      }
      console.log(error);
    }
  };

  const fetchSearchedAndFilteredEvents = async (apiUrl: string) => {
    try {
      // Make a GET request to fetch categories from the backend
      const response = await axios.get<Event[]>(apiUrl);

      console.log(response.data);

      // Set the fetched categories in the state
      setSearchedEvents(response.data);

      console.log("============categories======");
      console.log(searchedEvents);

      console.log("=========categories==============");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response && error.response.data) {
          // Handle specific error messages from backend
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          // Other errors
          toast.error("An error occurred");
        }
      } else {
        // Handle non-Axios errors
        toast.error("An error occurred");
        console.error("An error occurred:", error);
      }
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSearched(true);
    const apiUrl = `http://localhost:5000/api/v1/events/search?search=${searchTerm}&startDate=${value.startDate}&endDate=${value.endDate}&category=${category}`;
    console.log(apiUrl);
    fetchSearchedAndFilteredEvents(apiUrl);
    // Your form submission logic here
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const apiUrl = `http://localhost:5000/api/v1/events/search?search=${searchTerm}&startDate=${value.startDate}&endDate=${value.endDate}&category=${category}`;
    console.log("=========apiURL====================");
    console.log(apiUrl);
    console.log("====================================");
    fetchSearchedAndFilteredEvents(apiUrl);
  }, [category, value]);

  return (
    <>
      <div>
        <div className="mx-auto w-[80%] justify-around items-center sm:px-6 lg:px-8 flex flex-col sm:flex-row">
          <div className="mt-8 w-full">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex items-center space-x-4 flex-col  sm:flex-row"
            >
              <div>
                <div>
                  <select
                    id="category"
                    // value={category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setCategory(e.target.value);
                      setSearched(true);
                    }}
                    className="text-sm  group flex items-center justify-center p-2.5 text-center font-medium relative focus:z-10 focus:outline-none text-white bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-cyan-600 dark:enabled:hover:bg-cyan-700 dark:focus:ring-cyan-800 rounded-lg focus:ring-2"
                    // {...register("category_id", { valueAsNumber: true })}
                  >
                    <option value="-1">Select Category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        <div>{category.name},</div>
                      </option>
                    ))}
                  </select>
                  {/* <div>
            {errors.category_id ? (
              <p className="text-red-500 text-xs italic">
                {errors.category_id.message}
              </p>
            ) : (
              <div style={{ height: "1rem" }} />
            )}
          </div> */}
                </div>
                {/* <Dropdown label="All category" dismissOnClick={false}>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown> */}
              </div>
              <div className="relative flex-1 w-[30vh] sm:w-auto mt-3 sm:mt-0 ">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(e.target.value);
                  }}
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm rounded-lg border-s-2 border focus:ring-cyan-500 bg-gray-700 border-s-gray-700 border-cyan-600 placeholder-gray-400 text-white focus:border-cyan-500"
                  placeholder="Search Mockups, Logos, Design Templates..."
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white rounded-e-lg border border-cyan-800 focus:ring-4 focus:outline-none bg-cyan-700 hover:bg-cyan-800 focus:ring-cyan-800"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </button>
              </div>
            </form>
            {/* <SearchInput searched={searched} setSearched={setSearched} /> */}
          </div>
          <div className="flex mt-4 sm:mt-8  sm:pl-3 lg:pl-3 ">
            <DarkModeDatepicker
              placeholder="Start date - End date"
              value={value}
              handleValueChange={handleValueChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
