import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, updateUserRole, deleteUser, clearErrors } from "../../redux/actions/user.Action";
import { DELETE_USER_RESET, UPDATE_USER_ROLE_RESET } from "../../redux/constans/user.Constans";
import AdminLayout from "./AdminLayout";
import Loading from "../ui/Loading";
import toast from "react-hot-toast";
import { Trash2, Shield, User as UserIcon, Edit, Users } from "lucide-react";
import ConfirmDialog from "../ui/ConfirmDialog";

// Smart truncate: shows start + end for long emails
const smartTruncateEmail = (email, maxLength = 26) => {
    if (!email || email.length <= maxLength) return email;
    const [local, domain] = email.split("@");
    if (local.length > 15) {
        return `${local.slice(0, 12)}...@${domain}`;
    }
    return `${local.slice(0, maxLength - domain.length - 5)}...@${domain}`;
};

// Get initials
const getInitials = (name) => {
    if (!name) return "?";
    return name
        .trim()
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
};

const UsersList = () => {
    const dispatch = useDispatch();
    const { error, users, loading } = useSelector((state) => state.allUsers);
    const { error: deleteError, isDeleted, isUpdated, message } = useSelector((state) => state.userMutation);

    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
        confirmText: "Confirm",
    });

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearErrors()); }
        if (deleteError) { toast.error(deleteError); dispatch(clearErrors()); }
        if (isDeleted) { toast.success(message || "User deleted successfully"); dispatch({ type: DELETE_USER_RESET }); }
        if (isUpdated) { toast.success("User role updated successfully"); dispatch({ type: UPDATE_USER_ROLE_RESET }); }
        dispatch(getAllUsers());
    }, [dispatch, error, deleteError, isDeleted, isUpdated, message]);

    const openDialog = (title, message, onConfirm, confirmText = "Confirm") => {
        setDialog({ isOpen: true, title, message, onConfirm, confirmText });
    };

    const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));

    const deleteUserHandler = (id, name) => openDialog(
        "Delete User",
        `Are you sure you want to delete <strong>${name}</strong>? This action cannot be undone.`,
        () => dispatch(deleteUser(id)),
        "Delete"
    );

    const toggleRoleHandler = (id, name, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        openDialog(
            "Change User Role",
            `Change role of <strong>${name}</strong> to <strong>${newRole.toUpperCase()}</strong>?`,
            () => dispatch(updateUserRole(id, newRole)),
            "Change Role"
        );
    };

    // Take only latest 5 users for "Recent Users" preview
    const recentUsers = users?.slice(0, 5) || [];

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                <p className="text-gray-500 mt-1">Manage user roles and access</p>
            </div>

            {/* Recent Users Cards - Like Your Screenshot */}
            {recentUsers.length > 0 && (
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-5">
                        <Users className="w-6 h-6 text-orange-600" />
                        <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.map((user) => (
                            <div
                                key={user._id}
                                className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        {user.avatar?.url ? (
                                            <img
                                                src={user.avatar.url}
                                                alt={user.name}
                                                className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-lg"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{smartTruncateEmail(user.email)}</p>
                                    </div>
                                </div>
                                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Total Count */}
            <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 mb-6 text-sm font-semibold text-gray-700">
                Total Users: <span className="text-orange-600 text-lg">{users?.length || 0}</span>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loading />
                </div>
            ) : (
                /* Full Table */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users?.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-16 text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users?.map((user) => (
                                        <tr key={user._id} className="hover:bg-orange-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        {user.avatar?.url ? (
                                                            <img
                                                                src={user.avatar.url}
                                                                alt={user.name}
                                                                className="w-12 h-12 rounded-full object-cover ring-4 ring-white shadow-md"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-base shadow-md ring-4 ring-white">
                                                                {getInitials(user.name)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-400 font-mono">
                                                            ID: {user._id.slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm text-gray-600 font-medium" title={user.email}>
                                                    {smartTruncateEmail(user.email)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${user.role === "admin"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                    {user.role === "admin" ? <Shield size={14} /> : <UserIcon size={14} />}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => toggleRoleHandler(user._id, user.name, user.role)}
                                                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                                                        title="Toggle Role"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteUserHandler(user._id, user.name)}
                                                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={dialog.isOpen}
                onClose={closeDialog}
                onConfirm={() => { dialog.onConfirm(); closeDialog(); }}
                title={dialog.title}
                message={dialog.message}
                confirmText={dialog.confirmText}
                danger={dialog.confirmText === "Delete"}
            />
        </AdminLayout>
    );
};

export default UsersList;