"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Mail,
  Search,
  ShieldAlert,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks/auth.hook";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useDeleteUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/user.hook";
import type { IUser, UserRole, UserStatus } from "@/types/user.type";

export default function AdminUsersPage() {
  const { data: meRes } = useGetMe();
  const currentAdmin = meRes?.data?.user || meRes?.data;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: usersRes, isLoading } = useUsers({
    searchTerm: debouncedSearch || undefined,
    role: selectedRole,
    status: selectedStatus,
    page,
    limit: 15,
  });

  const updateStatusMutation = useUpdateUserStatus();
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();

  const users: IUser[] = usersRes?.data ?? [];
  const meta = usersRes?.meta;

  const handleToggleStatus = (targetUser: IUser) => {
    const nextStatus: UserStatus =
      targetUser.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    updateStatusMutation.mutate({
      id: targetUser.id,
      payload: { status: nextStatus },
    });
  };

  const handleChangeRole = (targetUser: IUser, newRole: UserRole) => {
    if (targetUser.role === newRole) return;
    updateRoleMutation.mutate({
      id: targetUser.id,
      payload: { role: newRole },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Quick stats calculations
  const totalCount = meta?.total ?? users.length;
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const blockedCount = users.filter((u) => u.status === "BLOCKED").length;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      <PageHeader
        title="User & Access Management"
        description="Monitor registered students, mentors, and administrators. Activate or block accounts in real time."
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {totalCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Users
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {activeCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="size-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Blocked Accounts
            </p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {blockedCount}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <UserX className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border/70 p-3.5 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by user name or email address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10 border-border/60 bg-background"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "STUDENT", "MENTOR", "ADMIN"] as const).map((role) => (
            <Button
              key={role}
              type="button"
              variant={selectedRole === role ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedRole(role);
                setPage(1);
              }}
              className="h-9 text-xs rounded-xl"
            >
              {role === "ALL" ? "All Roles" : role}
            </Button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {(["ALL", "ACTIVE", "BLOCKED"] as const).map((status) => (
            <Button
              key={status}
              type="button"
              variant={selectedStatus === status ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setSelectedStatus(status);
                setPage(1);
              }}
              className={`h-9 text-xs rounded-xl ${
                selectedStatus === status
                  ? status === "BLOCKED"
                    ? "bg-destructive/15 text-destructive font-semibold hover:bg-destructive/20"
                    : status === "ACTIVE"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-500/20"
                      : "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {status === "ALL" ? "All Status" : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Users List Table */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6 flex flex-col gap-4">
            {[
              "skel-u-1",
              "skel-u-2",
              "skel-u-3",
              "skel-u-4",
              "skel-u-5",
              "skel-u-6",
            ].map((skelKey) => (
              <div
                key={skelKey}
                className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Users className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              No users found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              No registered user match your current search terms or filters. Try
              adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Joined</th>
                  <th className="px-5 py-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((targetUser) => {
                  const isSelf = currentAdmin?.id === targetUser.id;
                  const isBlocked = targetUser.status === "BLOCKED";

                  return (
                    <tr
                      key={targetUser.id}
                      className="hover:bg-muted/30 transition-colors duration-150"
                    >
                      {/* User Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border border-border/70 shrink-0">
                            <AvatarImage
                              src={targetUser.imageUrl ?? undefined}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                              {targetUser.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm truncate flex items-center gap-1.5">
                              {targetUser.name}
                              {isSelf && (
                                <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-muted-foreground text-xs truncate flex items-center gap-1 mt-0.5">
                              <Mail className="size-3 shrink-0" />
                              {targetUser.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Pill & Switcher */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`px-2.5 py-0.5 font-semibold text-[11px] ${
                              targetUser.role === "ADMIN"
                                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : targetUser.role === "MENTOR"
                                  ? "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-400"
                                  : "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            }`}
                          >
                            {targetUser.role}
                          </Badge>

                          {/* Quick Role Toggle (disabled for self) */}
                          {!isSelf && (
                            <select
                              value={targetUser.role}
                              onChange={(e) =>
                                handleChangeRole(
                                  targetUser,
                                  e.target.value as UserRole,
                                )
                              }
                              disabled={updateRoleMutation.isPending}
                              aria-label={`Change role for ${targetUser.name}`}
                              className="text-[11px] bg-background border border-border/70 rounded-md px-1.5 py-1 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="STUDENT">Student</option>
                              <option value="MENTOR">Mentor</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="px-4 py-4">
                        {isBlocked ? (
                          <Badge className="bg-destructive/15 text-destructive border-destructive/30 gap-1.5 px-2.5 py-1 font-semibold">
                            <span className="size-1.5 rounded-full bg-destructive" />
                            BLOCKED
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 px-2.5 py-1 font-semibold">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ACTIVE
                          </Badge>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground/70" />
                          {targetUser.createdAt
                            ? new Date(targetUser.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </td>

                      {/* Moderation Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isSelf ? (
                            <span className="text-[11px] italic text-muted-foreground">
                              Protected
                            </span>
                          ) : (
                            <>
                              {/* Block / Activate Button with Dialog */}
                              <AlertDialog>
                                <AlertDialogTrigger
                                  render={
                                    <Button
                                      size="sm"
                                      variant={
                                        isBlocked ? "default" : "outline"
                                      }
                                      className={`h-8 text-xs font-semibold gap-1.5 rounded-lg px-3 ${
                                        isBlocked
                                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                          : "text-destructive border-destructive/40 hover:bg-destructive/10"
                                      }`}
                                      disabled={updateStatusMutation.isPending}
                                    >
                                      {isBlocked ? (
                                        <>
                                          <UserCheck className="size-3.5" />
                                          Activate
                                        </>
                                      ) : (
                                        <>
                                          <UserX className="size-3.5" />
                                          Block
                                        </>
                                      )}
                                    </Button>
                                  }
                                />
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      {isBlocked ? (
                                        <CheckCircle className="size-5 text-emerald-500" />
                                      ) : (
                                        <ShieldAlert className="size-5 text-destructive" />
                                      )}
                                      {isBlocked
                                        ? `Activate account for ${targetUser.name}?`
                                        : `Block account for ${targetUser.name}?`}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {isBlocked
                                        ? `Activating this account will restore ${targetUser.name}'s ability to log in, interact with mentors, and submit applications immediately.`
                                        : `Blocking this user will immediately invalidate active login sessions and prevent ${targetUser.name} from signing in or accessing platform services.`}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleToggleStatus(targetUser)
                                      }
                                      className={
                                        isBlocked
                                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                          : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      }
                                    >
                                      {isBlocked
                                        ? "Yes, Activate User"
                                        : "Yes, Block User"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              {/* Delete User */}
                              <AlertDialog>
                                <AlertDialogTrigger
                                  render={
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg flex items-center justify-center"
                                      title="Delete user"
                                      disabled={deleteMutation.isPending}
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  }
                                />
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                      <AlertTriangle className="size-5" />
                                      Delete user {targetUser.name}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove the user
                                      record and associated credentials. This
                                      action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDelete(targetUser.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete Permanently
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/60 text-xs text-muted-foreground bg-muted/20">
            <span>
              Showing Page {meta.page} of {meta.totalPages} ({meta.total} total
              accounts)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
