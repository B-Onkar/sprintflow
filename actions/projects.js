"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data, orgId = null) {
  const { userId, orgId: authOrgId } = auth();

  if (!orgId) {
    orgId = authOrgId;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Check if the user is an admin of the organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId,
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get project with sprints and organization
  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function deleteProject(projectId) {
  const { userId, orgId, orgRole } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.organizationId !== orgId || orgRole !== "org:admin") {
    const { data: membership } =
      await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: project.organizationId,
      });

    const userMembership = membership.find(
      (member) => member.publicUserData.userId === userId,
    );

    if (!userMembership || userMembership.role !== "org:admin") {
      throw new Error("Only organization admins can delete projects");
    }
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}

export async function getProject(projectId) {
  const { userId, orgId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get project with sprints
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Verify user belongs to the project's organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: project.organizationId,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData.userId === userId,
  );

  if (!userMembership) {
    return null;
  }

  return project;
}
