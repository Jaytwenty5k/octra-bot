import { Link } from "react-router-dom";

export default function Navbar() {
  return (
      <nav className="bg-gray-800 px-4 py-3 shadow">
            <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-white">
                              Octra Bot
                                      </Link>
                                              <div>
                                                        <Link to="/" className="text-white mx-2">Home</Link>
                                                                  <Link to="/login" className="text-white mx-2">Login</Link>
                                                                          </div>
                                                                                </div>
                                                                                    </nav>
                                                                                      );
                                                                                      }