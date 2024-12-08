"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { User } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axiosClient";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleStatusChange(email: string) {
    try {
      const response = await axiosClient.patch(`/admin/user`, { email });
      if (response) {
        toast.success("Status Updated Successfully");
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === email ? { ...user, active: !user.active } : user
          )
        );
      } else {
        toast.warning("Status Update Unsuccessful");
      }
    } catch (error) {
      console.error(error);
      toast.error("Status Updation Failed");
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users`
        );
        if (response) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Loading Users Failed");
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  return (
    <div className="text-left my-6 px-4 sm:px-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">Users Management</h1>
      <div className="border p-4 sm:p-5 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold">Search Users</h1>
        </div>
        <Input
          placeholder="Search by name, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-3"
        />
      </div>
      <div className="border p-4 sm:p-5 rounded-lg mt-5 overflow-x-auto">
        <Table>
          <TableCaption className="sr-only">
            A list of confidently users
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[200px]">Activity</TableHead>
              <TableHead className="w-[100px]">Subscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.active ? "Active" : "Blocked"}</TableCell>
                  <TableCell>{user.subscription ? "Pro" : "Free"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleStatusChange(user.email)}
                      variant={user.active ? "destructive" : "outline"}
                      className={
                        user.active
                          ? "hover:bg-red-700 hover:text-white"
                          : "bg-green-500 text-white hover:bg-green-700"
                      }
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No Users Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WithAdminAuth(UsersList);
