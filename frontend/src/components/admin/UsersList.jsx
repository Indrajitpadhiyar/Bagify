import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, updateUserRole, deleteUser, clearErrors } from "../../redux/actions/user.Action";
import { DELETE_USER_RESET, UPDATE_USER_ROLE_RESET } from "../../redux/constans/user.Constans";
import AdminLayout from "./AdminLayout";
import Loading from "../ui/Loading";
import toast from "react-hot-toast";
import { Trash2, AlertCircle, Shield, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UsersList = () => {
    const dispatch = useDispatch();

    const { error, users, loading } = useSelector((state) => state.allUsers);
    const {
        error: deleteError,
        isDeleted,
        isUpdated,
        message,
    } = useSelector((state) => state.userMutation);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success(message || "User Deleted Successfully");
            dispatch({ type: DELETE_USER_RESET });
        }

        if (isUpdated) {
            toast.success("User Role Updated Successfully");
            dispatch({ type: UPDATE_USER_ROLE_RESET });
        }

        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, isUpdated, message]);

    const deleteUserHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id));
        }
    };

    const toggleRoleHandler = (id, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (window.confirm(`Are you sure you want to change role to ${newRole}?`)) {
            dispatch(updateUserRole(id, newRole));
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                    <p className="text-gray-500 mt-1">Manage user roles and access</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm text-gray-600 font-medium">
                    Total Users: {users ? users.length : 0}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loading />
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100/50 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">User ID</th>
                                    <th className="px-6 py-4 font-semibold">Details</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {users &&
                                        users.map((user) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-orange-50/30 transition-colors group"
                                            >
                                                <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                                    {user._id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                                                            {user.avatar && user.avatar.url ? (
                                                                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                user.name.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">{user.name}</p>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleRoleHandler(user._id, user.role)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all hover:scale-105 active:scale-95 cursor-pointer ${user.role === "admin"
                                                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                            }`}
                                                        title="Click to toggle role"
                                                    >
                                                        {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                                        {user.role}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => deleteUserHandler(user._id)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                </AnimatePresence>
                                {users && users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-12 text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <AlertCircle size={40} className="text-gray-300" />
                                                <p>No users found</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default UsersList;
