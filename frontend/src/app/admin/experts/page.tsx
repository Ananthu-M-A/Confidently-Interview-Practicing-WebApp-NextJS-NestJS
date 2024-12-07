"use client";

import WithAdminAuth from "@/components/auth-guards/WithAdminAuth";
import { Input } from "@/components/ui/input";
import Link from "next/link";
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
import { Expert } from "@/interfaces/expert.interface";

const ExpertsList = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function handleStatusChange(email: string) {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/expert`,
        { email }
      );
      if (response) {
        toast.success("Status Updated Successfully");
        setExperts((prevExperts) =>
          prevExperts.map((expert) =>
            expert.email === email
              ? { ...expert, active: !expert.active }
              : expert
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
    async function getExperts() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/experts`
        );
        if (response) {
          setExperts(response.data);
          setFilteredExperts(response.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Loading Experts Failed");
      }
    }
    getExperts();
  }, []);

  useEffect(() => {
    const results = experts.filter(
      (expert) =>
        expert.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExperts(results);
  }, [searchTerm, experts]);

  return (
    <div className="text-left my-6 px-4 sm:px-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">Experts Management</h1>
      <div className="border p-4 sm:p-5 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold">Search Experts</h1>
          <Link
            href="/admin/experts/new"
            className="text-lg font-bold border-2 border-black px-3 py-1 rounded-full hover:bg-black hover:text-white"
          >
            + Add Expert
          </Link>
        </div>
        <Input
          placeholder="Search by name, email, or specialization"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-3"
        />
      </div>
      <div className="border p-4 sm:p-5 rounded-lg mt-5 overflow-x-auto">
        <Table>
          <TableCaption className="sr-only">A list of confidently experts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[200px]">Specialization</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{expert.fullname}</TableCell>
                  <TableCell>{expert.email}</TableCell>
                  <TableCell>{expert.specialization}</TableCell>
                  <TableCell>{expert.active ? "Active" : "Blocked"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleStatusChange(expert.email)}
                      variant={expert.active ? "destructive" : "outline"}
                      className={
                        expert.active
                          ? "hover:bg-red-700 hover:text-white"
                          : "bg-green-500 text-white hover:bg-green-700"
                      }
                    >
                      {expert.active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No Experts Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WithAdminAuth(ExpertsList);