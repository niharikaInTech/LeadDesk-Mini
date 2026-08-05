import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    Link,
    useNavigate
} from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_URL = "https://leaddesk-mini-backend-hmnq.onrender.com";

function Footer() {
    return (
        <footer className="footer">
            <p>
                Built for{" "}
                <a
                    href="https://digitalheroesco.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Digital Heroes Training Task
                </a>
            </p>
        </footer>
    );
}

function HomePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [budget, setBudget] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function submitLead(event) {
        event.preventDefault();
        setSubmitting(true);

        axios.post(API_URL + "/add-lead", {
            name: name,
            email: email,
            budget: budget,
            message: message
        })
            .then(function (response) {
                alert(response.data.message);

                setName("");
                setEmail("");
                setBudget("");
                setMessage("");
            })
            .catch(function (error) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Unable to submit the enquiry";

                alert(errorMessage);
            })
            .finally(function () {
                setSubmitting(false);
            });
    }

    return (
        <div className="page">
            <nav className="navbar">
                <h1 className="logo">LeadDesk Mini</h1>

                <Link className="nav-button" to="/login">
                    Admin Login
                </Link>
            </nav>

            <main className="hero">
                <div className="hero-text">
                    <h2>Turn website visitors into real customers</h2>

                    <p>
                        Collect customer enquiries, store lead details and
                        manage business opportunities from one place.
                    </p>
                </div>

                <div className="form-card">
                    <h3>Request a callback</h3>

                    <form onSubmit={submitLead}>
                        <label>Full name</label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={function (event) {
                                setName(event.target.value);
                            }}
                            required
                        />

                        <label>Email address</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={function (event) {
                                setEmail(event.target.value);
                            }}
                            required
                        />

                        <label>Budget range</label>

                        <select
                            value={budget}
                            onChange={function (event) {
                                setBudget(event.target.value);
                            }}
                            required
                        >
                            <option value="">Select your budget</option>

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

                        <label>Message</label>

                        <textarea
                            placeholder="Tell us about your requirement"
                            value={message}
                            onChange={function (event) {
                                setMessage(event.target.value);
                            }}
                            required
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Enquiry"}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);

    const navigate = useNavigate();

    useEffect(function () {
        const token = localStorage.getItem("adminToken");

        if (token) {
            navigate("/admin");
        }
    }, [navigate]);

    function loginAdmin(event) {
        event.preventDefault();
        setLoggingIn(true);

        axios.post(API_URL + "/login", {
            email: email,
            password: password
        })
            .then(function (response) {
                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                navigate("/admin");
            })
            .catch(function (error) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Unable to login";

                alert(errorMessage);
            })
            .finally(function () {
                setLoggingIn(false);
            });
    }

    return (
        <div className="page">
            <nav className="navbar">
                <h1 className="logo">LeadDesk Mini</h1>

                <Link className="nav-button secondary-button" to="/">
                    Back to Home
                </Link>
            </nav>

            <main className="login-section">
                <div className="login-card">
                    <h2>Admin Login</h2>

                    <p>
                        Enter your admin credentials to manage leads.
                    </p>

                    <form onSubmit={loginAdmin}>
                        <label>Email address</label>

                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={function (event) {
                                setEmail(event.target.value);
                            }}
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={function (event) {
                                setPassword(event.target.value);
                            }}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loggingIn}
                        >
                            {loggingIn ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AdminPage() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    function getTokenConfig() {
        const token = localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: "Bearer " + token
            }
        };
    }

    function handleUnauthorized(error) {
        if (error.response?.status === 401) {
            localStorage.removeItem("adminToken");

            alert("Your login has expired. Please login again.");

            navigate("/login");

            return true;
        }

        return false;
    }

    function getLeads(searchText) {
        setLoading(true);

        axios.get(
            API_URL +
                "/leads?search=" +
                encodeURIComponent(searchText || ""),
            getTokenConfig()
        )
            .then(function (response) {
                setLeads(response.data);
            })
            .catch(function (error) {
                if (!handleUnauthorized(error)) {
                    alert("Unable to fetch leads");
                }
            })
            .finally(function () {
                setLoading(false);
            });
    }

    useEffect(function () {
        getLeads("");
    }, []);

    function searchLeads(event) {
        event.preventDefault();
        getLeads(search);
    }

    function updateStatus(id, newStatus) {
        axios.put(
            API_URL + "/lead/" + id,
            {
                status: newStatus
            },
            getTokenConfig()
        )
            .then(function () {
                getLeads(search);
            })
            .catch(function (error) {
                if (!handleUnauthorized(error)) {
                    alert("Unable to update lead status");
                }
            });
    }

    function logout() {
        localStorage.removeItem("adminToken");
        navigate("/login");
    }

    return (
        <div className="page">
            <nav className="navbar">
                <h1 className="logo">LeadDesk Mini</h1>

                <div className="nav-actions">
                    <Link
                        className="nav-button secondary-button"
                        to="/"
                    >
                        Home
                    </Link>

                    <button
                        className="nav-button logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard">
                <h2>Admin Dashboard</h2>

                <p>
                    View, search and update customer enquiries.
                </p>

                <form
                    className="search-form"
                    onSubmit={searchLeads}
                >
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={function (event) {
                            setSearch(event.target.value);
                        }}
                    />

                    <button type="submit">
                        Search
                    </button>

                    <button
                        type="button"
                        className="clear-button"
                        onClick={function () {
                            setSearch("");
                            getLeads("");
                        }}
                    >
                        Clear
                    </button>
                </form>

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
                            {loading ? (
                                <tr>
                                    <td colSpan="5">
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
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
                                                    onChange={function (event) {
                                                        updateStatus(
                                                            lead._id,
                                                            event.target.value
                                                        );
                                                    }}
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
            </main>

            <Footer />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;