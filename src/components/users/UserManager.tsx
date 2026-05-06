"use client";

import { useState } from "react";
import { User, Shield, UserPlus, Pencil, Trash2, Mail } from "lucide-react";
import { UserForm } from "./UserForm";
import { deleteUser } from "@/app/(dashboard)/users/actions";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserManagerProps {
  users: UserData[];
}

export function UserManager({ users }: UserManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete user");
      }
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary-600" />
            User Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Control access roles and system permissions for clinic staff.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-all hover:scale-105"
          >
            <UserPlus className="h-5 w-5" />
            New User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="col-span-1 divide-y divide-slate-200 rounded-2xl bg-white shadow-sm border border-slate-200 transition-all hover:shadow-lg group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                    {user.name}
                  </h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
                    user.role === "ADMIN" ? "bg-red-50 text-red-700 ring-red-600/20" : 
                    user.role === "DOCTOR" ? "bg-blue-50 text-blue-700 ring-blue-600/20" : 
                    "bg-slate-50 text-slate-700 ring-slate-600/20"
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </div>
            </div>
            <div className="bg-slate-50/50 p-2 flex gap-2">
              <button
                onClick={() => {
                  setEditingUser(user);
                  setIsFormOpen(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 hover:text-primary-600 hover:bg-white rounded-xl transition-all"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-white rounded-xl transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser || undefined}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
