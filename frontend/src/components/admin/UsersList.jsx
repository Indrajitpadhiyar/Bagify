import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUserRole, deleteUser, clearErrors } from "../../redux/actions/user.Action";
import { DELETE_USER_RESET, UPDATE_USER_ROLE_RESET } from "../../redux/constans/user.Constans";
import AdminLayout from "./AdminLayout";
import Loading from "../ui/Loading";
import toast from "react-hot-toast";
import { Trash2, Shield, User as UserIcon, Edit } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog"; // ← NEW

const UsersList = () => {
    const dispatch = useDispatch();

    const { error, users, loading } = useSelector((state) => state.allUsers);
    const { error: deleteError, isDeleted, isUpdated, message } = useSelector((state) => state.userMutation);

    // Dialog state
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        confirmText: "Confirm",
    });

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
            toast.success(message || "User deleted successfully");
            dispatch({ type: DELETE_USER_RESET });
        }
        if (isUpdated) {
            toast.success("User role updated successfully");
            dispatch({ type: UPDATE_USER_ROLE_RESET });
        }

        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, isUpdated, message]);

    const openDialog = (title, message, onConfirm, confirmText = "Confirm") => {
        setDialog({ isOpen: true, title, message, onConfirm, confirmText });
    };

    const closeDialog = () => {
        setDialog({ ...dialog, isOpen: false });
    };

    const deleteUserHandler = (id, name) => {
        openDialog(
            "Delete User",
            `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            () => dispatch(deleteUser(id)),
            "Delete"
        );
    };

    const toggleRoleHandler = (id, name, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        openDialog(
            "Change User Role",
            `Change role of "${name}" to ${newRole.toUpperCase()}?`,
            () => dispatch(updateUserRole(id, newRole)),
            "Change Role"
        );
    };

    return (
        <AdminLayout>
            {/* Your header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                    <p className="text-gray-500 mt-1">Manage user roles and access</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm text-gray-600 font-medium">
                    Total Users: {users?.length || 0}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loading /></div>
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
                                {users?.map((user) => (
                                    <tr key={user._id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-400">{user._id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                                                    {user.avatar?.url ? (
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
                                                onClick={() => toggleRoleHandler(user._id, user.name, user.role)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all hover:scale-105 ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {user.role === "admin" ? <Shield size={12} /> : <UserIcon size={12} />}
                                                {user.role}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => toggleRoleHandler(user._id, user.name, user.role)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Change Role"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUserHandler(user._id, user.name)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users?.length === 0 && (
                            <div className="text-center py-16 text-gray-500">
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Beautiful Confirm Dialog */}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                onClose={closeDialog}
                onConfirm={dialog.onConfirm}
                title={dialog.title}
                message={dialog.message}
                confirmText={dialog.confirmText}
            />
        </AdminLayout>
    );
};

export default UsersList;