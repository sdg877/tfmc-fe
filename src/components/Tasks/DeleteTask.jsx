import axios from "axios";

const DeleteTask = ({ taskId, googleEventId, setTasks }) => {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL;

  const handleDelete = async (e) => {
    e.stopPropagation();
    console.log("Attempting to delete Google Event ID:", googleEventId);
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      if (googleEventId) {
        try {
          await axios.delete(
            `${baseURL}/users/calendar/event/${googleEventId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
        } catch (gErr) {
          console.error("Google event already gone or delete failed:", gErr);
        }
      }

      await axios.delete(`${baseURL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete task.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="btn btn-sm text-danger border-0 p-0 px-2"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  );
};

export default DeleteTask;
