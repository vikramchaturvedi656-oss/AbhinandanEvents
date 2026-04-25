import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../utils/api";
import {
  clearStoredUser,
  getDashboardPath,
  getStoredUser,
  saveStoredUser,
} from "../utils/session";

const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getStoredUser());
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingSelection, setSavingSelection] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingImage, setPendingImage] = useState("");
  const [pendingFileName, setPendingFileName] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await authApi.getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(data.user);
        saveStoredUser(data.user);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (loadError.response?.status === 401) {
          clearStoredUser();
          setUser(null);
          return;
        }

        setError(
          loadError.response?.data?.message ||
            "Unable to load your profile right now."
        );
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedAvatar = pendingImage || user?.profileImage || "";

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setNotice("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please choose a PNG, JPEG, or WEBP image.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setError("Please choose an image smaller than 2MB.");
      return;
    }

    setSavingSelection(true);

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setPendingImage(imageDataUrl);
      setPendingFileName(file.name);
      setNotice("Photo selected. Save it to update your profile.");
    } catch (fileError) {
      setError(fileError.message);
    } finally {
      setSavingSelection(false);
      event.target.value = "";
    }
  };

  const handleUpload = async () => {
    if (!pendingImage) {
      setError("Choose a photo before saving.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const { data } = await authApi.updateProfileImage({
        profileImage: pendingImage,
      });
      setUser(data.user);
      saveStoredUser(data.user);
      setPendingImage("");
      setPendingFileName("");
      setNotice(data.message || "Profile photo updated successfully.");
    } catch (uploadError) {
      setError(
        uploadError.response?.data?.message ||
          "Unable to upload your profile photo right now."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setUploading(true);
    setError("");
    setNotice("");

    try {
      const { data } = await authApi.updateProfileImage({
        profileImage: "",
      });
      setUser(data.user);
      saveStoredUser(data.user);
      setPendingImage("");
      setPendingFileName("");
      setNotice(data.message || "Profile photo removed successfully.");
    } catch (removeError) {
      setError(
        removeError.response?.data?.message ||
          "Unable to remove your profile photo right now."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
    } finally {
      clearStoredUser();
      navigate("/login");
    }
  };

  if (loadingProfile) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-slate-300">
          Loading your profile...
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Profile</h1>
          <p className="mt-3 text-slate-300">Login to view your account details.</p>
          <Link to="/login" className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-300">Profile</div>
            <h1 className="mt-2 text-4xl font-semibold text-white">{user.name}</h1>
            <p className="mt-3 text-slate-300">{user.email}</p>
          </div>
          {selectedAvatar ? (
            <img
              src={selectedAvatar}
              alt={user.name || "User"}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-amber-300/20"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-3xl font-semibold text-slate-950">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        {(error || notice) && (
          <div className="mt-6 space-y-3">
            {error && (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            )}
            {notice && (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                {notice}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Role</div>
            <div className="mt-2 text-2xl font-semibold text-white">{user.role}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Phone</div>
            <div className="mt-2 text-2xl font-semibold text-white">{user.phone || "Not added"}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">User ID</div>
            <div className="mt-2 text-sm font-semibold text-white">{user.id || user._id || "Unavailable"}</div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Profile photo</div>
              <div className="mt-2 text-lg font-semibold text-white">
                Upload a picture after login
              </div>
              <p className="mt-1 text-sm text-slate-300">
                PNG, JPEG, or WEBP up to 2MB.
                {pendingFileName ? ` Selected: ${pendingFileName}` : ""}
              </p>
            </div>

            <label className="cursor-pointer rounded-full border border-white/10 px-5 py-3 text-slate-100 transition hover:bg-white/5">
              {savingSelection ? "Preparing..." : "Choose photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={savingSelection || uploading}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!pendingImage || uploading}
              className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Saving..." : "Save photo"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingImage("");
                setPendingFileName("");
                setNotice("");
                setError("");
              }}
              disabled={!pendingImage || uploading}
              className="rounded-full border border-white/10 px-5 py-3 text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel selection
            </button>
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={(!user.profileImage && !pendingImage) || uploading}
              className="rounded-full border border-rose-400/30 px-5 py-3 text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Remove photo
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={getDashboardPath(user.role)} className="rounded-full bg-amber-400 px-5 py-3 font-semibold text-slate-950">
            Open dashboard
          </Link>
          <Link to="/" className="rounded-full border border-white/10 px-5 py-3 text-slate-100">
            Browse planners
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-rose-400/30 px-5 py-3 text-rose-200"
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
