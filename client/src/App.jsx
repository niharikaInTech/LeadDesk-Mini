import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [page, setPage] = useState("home");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [budget, setBudget] = useState("");
    const [message, setMessage] = useState("");

    const [leads, setLeads] = useState([]);

    function submitLead(e) {
        e.preventDefault();

        axios.post("https://leaddesk-mini-backend.onrender.com/add-lead", {
            name: name,
            email: email,
            budget: budget,
            message: message
        })
        .then(function () {
            alert("Lead Submitted Successfully");

            setName("");
            setEmail("");
            setBudget("");
            setMessage("");
        })
        .catch(function () {
            alert("Something went wrong");
        });
    }

    function getLeads() {
        axios.get("https://leaddesk-mini-backend.onrender.com")
            .then(function (response) {
                setLeads(response.data);
            })
            .catch(function () {
                alert("Unable to fetch leads");
            });
    }

    function openAdminPage() {
        setPage("admin");
        getLeads();
    }

    function updateStatus(id, status) {
        axios.put("https://leaddesk-mini-backend.onrender.com" + id, {
            status: status
        })
        .then(function () {
            getLeads();
        })
        .catch(function () {
            alert("Unable to update status");
        });
    }

    useEffect(function () {
        if (page === "admin") {
            getLeads();
        }
    }, [page]);

    if (page === "admin") {
        return (
            <div className="page">
                <nav className="navbar">
                    <h1 className="logo">LeadDesk Mini</h1>

                    <button
                        className="nav-button"
                        onClick={() => setPage("home")}
                    >
                        Home
                    </button>
                </nav>

                <section className="dashboard">
                    <h2>Admin Dashboard</h2>
                    <p>View and manage customer enquiries.</p>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Budget</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No leads found
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map(function (lead) {
                                        return (
                                            <tr key={lead._id}>
                                                <td>{lead.name}</td>
                                                <td>{lead.email}</td>
                                                <td>{lead.budget}</td>
                                                <td>{lead.message}</td>

                                                <td>
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) =>
                                                            updateStatus(
                                                                lead._id,
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="New">
                                                            New
                                                        </option>

                                                        <option value="Contacted">
                                                            Contacted
                                                        </option>

                                                        <option value="Closed">
                                                            Closed
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page">
            <nav className="navbar">
                <h1 className="logo">LeadDesk Mini</h1>

                <button
                    className="nav-button"
                    onClick={openAdminPage}
                >
                    Admin Dashboard
                </button>
            </nav>

            <section className="hero">
                <div className="hero-text">
                    <h2>Turn website visitors into real customers</h2>

                    <p>
                        Collect customer enquiries, store lead details
                        and manage business opportunities from one place.
                    </p>
                </div>

                <div className="form-card">
                    <h3>Request a callback</h3>

                    <form onSubmit={submitLead}>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <select
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                        >
                            <option value="">Select budget</option>
                            <option value="$500 - $1,000">
                                $500 - $1,000
                            </option>
                            <option value="$1,000 - $5,000">
                                $1,000 - $5,000
                            </option>
                            <option value="$5,000+">
                                $5,000+
                            </option>
                        </select>

                        <textarea
                            placeholder="Tell us about your requirement"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Submit Enquiry
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default App;