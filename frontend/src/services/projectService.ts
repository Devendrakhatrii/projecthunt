import { Project } from "@/types/Project";
import axiosInstance from "@/lib/axiosInstance";
import { handleAxiosError } from "@/lib/axiosError";

const API_BASE = "projects";

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await axiosInstance.get(API_BASE);
    return res.data.data as Project[];
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await axiosInstance.get(`${API_BASE}/${id}`);
    const project = res.data?.data;

    // Checking if `project` is null, empty object, or empty array
    if (!project || Object.keys(project).length === 0) {
      return null;
    }

    return project as Project;
  } catch (error) {
    // Optional: log the error
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function createProject(project: Project): Promise<Project> {
  try {
    const res = await axiosInstance.post(API_BASE, project, {
      withCredentials: true,
    });
    return res.data.data as Project;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

export async function updateProject(
  id: string,
  project: Partial<Project>
): Promise<Project> {
  try {
    const res = await axiosInstance.put(`${API_BASE}/${id}`, project, {
      withCredentials: true,
    });
    return res.data.data as Project;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`${API_BASE}/${id}`, { withCredentials: true });
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
}

export async function searchProjects(query: string): Promise<Project[]> {
  try {
    const res = await axiosInstance.get(`${API_BASE}/search`, {
      params: { search: query },
    });
    return res.data.data as Project[];
  } catch (error) {
    handleAxiosError(error);
    return [];
  }
}
