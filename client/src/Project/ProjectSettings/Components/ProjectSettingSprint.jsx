import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Axios from "axios";
import { addSprintToProject } from "../../../redux/ProjectData/activeProjectSprintListSlice";

function ProjectSettingSprint() {
  const dispatch = useDispatch();
  const workspaceName = useSelector(
    (state) => state.workspaceNameId.value.name
  );
  const projectName = useSelector((state) => state.activeProject.value.name);
  const projectID = useSelector((state) => state.activeProject.value._id);
  const [sprintName, setSprintName] = useState("");
  const currentDate = new Date();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const sprintList = useSelector(
    (state) => state.activeProjectSprintList.value
  );

  const handleInputChangeSprintName = (event) => {
    const changedValue = event.target.value;
    setSprintName(changedValue);
  };

  const startDateHandler=(e)=>{
    // console.log(e.target.value);
    setStartDate(e.target.value);
  }
  const endDateHandler=(e)=>{
    // console.log(e.target.value);
    setEndDate(e.target.value);
  }

  const handleCreate = async () => {
    if (sprintName === "") {
      toast.error("Please enter Sprint Name!!");
    } else if (startDate < currentDate) {
      toast.error("Please select valid start date for sprint!!");
    } else if (endDate < startDate) {
      toast.error("End date cannot be before start date!!");
    } else {
      try {
        const data = {
          projectID: projectID,
          name: sprintName,
          startDate: startDate,
          endDate: endDate,
        };
        const response = await Axios.post(
          "http://localhost:8000/api/createSprint",
          data,
          {
            withCredentials: true,
          }
        );
        if (response.status === 201) {
          console.log(response.data.message);
          toast.success("Sprint Successfully Created"); // Notify user about successful update
          dispatch(addSprintToProject(response.data.sprint));
          // window. location. reload();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error while storeing Project:", error);
      }
    }
  };

  return (
    <div className="bg-gray-800 w-full h-screen text-white justify-center p-10">
      <div
        className="flex flex-col rounded mx-auto h-[100%] mb-4 w-full lg:w-[60%] bg-gray-900 p-3 overflow-auto "
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0) rgba(0,0,0,0)",
        }}
      >
        <div className="text-gray-400 text-base mb-2">
          {workspaceName}
          <span className="mx-2"> / </span> {projectName}
        </div>
        <div className="text-3xl tracking-wide font-semibold mb-4 border-b border-gray-600 pb-3 ">
          Create Sprint
        </div>
        <div class="flex flex-col sm:items-center mb-4">
          <div className="flex flex-row items-center ml-5">
            <label class="block text-lg text-white w-40" htmlFor="sprintName">Sprint Name</label>
            <input
              name="name"
              id="sprintName"
              value={sprintName}
              onChange={handleInputChangeSprintName}
              class="h-9 ml-10 bg-gray-800 text-white px-4 rounded inline-flex justify-center items-center sm:w-80 w-40 overflow-x-hidden"
            />
          </div>
          <div className="flex flex-row items-center ml-5 mt-3">
            <label class="block text-lg text-white w-40" htmlFor="startDate">Select Start Date </label>
            <input type="date"
            id="startDate"
            selected={startDate}
            onChange={startDateHandler}
              className="h-9 ml-10 bg-gray-800 text-white px-4 rounded inline-flex justify-center items-center focus:outline-none sm:w-80 w-40"
            
            />
          </div>
          <div className="flex flex-row items-center ml-5 mt-3">
          <label class="block text-lg text-white w-40" htmlFor="startDate">Select End Date </label>
            <input type="date"
            id="startDate"
            selected={endDate}
            onChange={endDateHandler}
              className="h-9 ml-10 bg-gray-800 text-white px-4 rounded inline-flex justify-center items-center focus:outline-none sm:w-80 w-40"
            
            />
          </div>

          <button
            className="text-center ml-5 mt-5 px-4 py-2 bg-[#9333EA] rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:outline-none hover:bg-[#9233eac6] hover:ring hover:ring-indigo-300 disabled:opacity-25 transition w-[20%]"
            onClick={() => handleCreate()}
          >
            Create Sprint
          </button>
        </div>
        <h1 className="text-3xl tracking-wide text-center font-semibold mt-4 mb-4 border-y border-gray-600 py-3 ">
          List of Sprints
        </h1>
        <div className="h-full w-full overflow-scroll">
          <div className="w-full flex flex-col items-center">
            {sprintList.slice().reverse().map((sprint) => (
              <div
                key={sprint._id}
                className="w-full  border-b border-gray-600 p-4 mb-4"
              >
                <div className="text-center text-xl font-medium mb-2 ">
                  {sprint.name}
                </div>
                <div className="flex justify-between text-sm">
                  <div>{new Date(sprint.startDate).toDateString()}</div>
                  <div>{new Date(sprint.endDate).toDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProjectSettingSprint;
