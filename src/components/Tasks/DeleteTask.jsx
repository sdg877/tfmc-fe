import axios from "axios";

const DeleteTask = ({ taskId, googleEventId, setTasks }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (window.confirm("Delete this task from the app and Google Calendar?")) {
      try {
        await axios.delete(`${baseURL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (err) {
        console.error(
          "Delete request failed:",
          err.response?.data || err.message,
        );
        alert("Could not delete. Check your connection or Google permissions.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-sm text-danger border-0 opacity-50 p-0 px-2"
      title="Delete Task"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );
};

export default DeleteTask;
