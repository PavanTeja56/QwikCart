import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

function Tasks() {
    const [task, setTask] = useState("");
    const [data, setData] = useState([]);

    const handleTasks = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/tasks", { task });
            
            if (res.data === 'fail') {
                toast.error("Task set failed");
            } else {
                setData(res.data); // assuming it's an array of tasks
                toast.success("Task set done");
            }
        } catch (e) {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <h1>Give task</h1><br />
            <form onSubmit={handleTasks}>
                <input
                    type="text"
                    onChange={(e) => setTask(e.target.value)}
                    value={task}
                    placeholder="Enter your task"
                />
                <input type="submit" value="Add Task" />
            </form>
            <div>
                {Array.isArray(data) &&
                    data.map((e, i) => (
                        <p key={i}>{e.task}</p>
                    ))
                }
            </div>
        </>
    );
}

export default Tasks;
