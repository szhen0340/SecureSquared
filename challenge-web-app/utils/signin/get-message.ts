"use server";

export const getMessage = async (similarity: number) => {
  return similarity > 0.6
    ? "Your identity has been verified. The flag is flame{3mb3dd1ngs_4r3_gr8!}."
    : "Your identity could not be verified. Please try again.";
};
