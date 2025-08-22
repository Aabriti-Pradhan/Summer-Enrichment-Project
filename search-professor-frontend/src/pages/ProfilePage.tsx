import { useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./ProfilePage.css";

function ProfilePage() {
  const defaultValues = {
    name: "",
    bio: "",
    email: "",
    skills: "",
    config: {
      mode: "view",
    },
  };

  const methods = useForm({ defaultValues });
  const { watch, reset, setValue, register } = methods;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("accessToken"); // assuming you stored JWT here
        const response = await axios.get(
          "http://localhost:5000/api/verify/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // backend sends { message: "...", user: {...} }
        reset({
          ...response.data.user,
          config: { mode: "view" },
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    }

    fetchProfile();
  }, [reset]);

  const data = watch();

  const OnClickEdit = () => {
    setValue("config.mode", "edit");
  };

  const GoBackButton = () => {
    setValue("config.mode", "view");
  };

  return (
    <div className="profile-page">
      <div>
        <h1>Profile Page</h1>

        {data?.config?.mode === "view" && (
          <>
            <div className="user-info-box">
              <div>
                <p>Name : {data?.name}</p>
                <p>Email : {data?.email}</p>
                <p>Bio : {data?.bio}</p>
                <p>Skills : {data?.skills}</p>
              </div>
              <button onClick={OnClickEdit}>Edit Profile</button>
            </div>
          </>
        )}

        {data?.config?.mode === "edit" && (
          <div className="profile-edit">
            <input {...register("name")} placeholder="Name" />
            <input {...register("email")} placeholder="Email" />
            <textarea {...register("bio")} placeholder="Bio" />
            <input {...register("skills")} placeholder="Skills" />
            <div className="profile-edit-buttons">
              <button onClick={GoBackButton}>Go Back</button>
              <button>Update</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
