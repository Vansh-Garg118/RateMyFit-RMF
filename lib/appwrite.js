import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

const endpoint = process.env.EXPO_PUBLIC_endpoint
const platform = process.env.EXPO_PUBLIC_platform
const projectId = process.env.EXPO_PUBLIC_projectId
const databaseId = process.env.EXPO_PUBLIC_databaseId
const userCollectionId = process.env.EXPO_PUBLIC_userCollectionId
const videoCollectionId = process.env.EXPO_PUBLIC_videoCollectionId
const imageCollectionId = process.env.EXPO_PUBLIC_imageCollectionId
const storageId = process.env.EXPO_PUBLIC_storageId

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    console.log("destroyed Session");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// export const getAllPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       databaseId,
//       videoCollectionId,
//     );
//     // console.log(posts.documents)
//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export const getAllPosts = async () => {
  try {
    const [videos, images] = await Promise.all([
      databases.listDocuments(
        databaseId,
        videoCollectionId
      ),
      databases.listDocuments(
        databaseId,
        imageCollectionId
      )
    ]);
    // console.log(videos.documents)
    // console.log(images.documents)

    return {
      videos: videos.documents,
      images: images.documents
    };
    
  } catch (error) {
    throw new Error(error);
  }
};


export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(10))]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search("title", query)]
    );
    // console.log(posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId)]
    );
    // console.log(posts.documents)
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      //image
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("invalid file type");
    }

    if (!fileUrl) {
      throw Error;
    }
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    console.log("uploading");
    
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        desc: form.desc,
        creator: form.userId,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};





// POSTS
export const likePost = async (postId, userId, isVideo = true) => {
  try {
    console.log(isVideo)
    const collectionId = isVideo
      ? videoCollectionId
      : imageCollectionId;

      // console.log(collectionId)
    const post = await databases.getDocument(
      databaseId,
      collectionId,
      postId
    );

    let updatedLikes = post.likes || [];
    
    if (updatedLikes.includes(userId)) {
      updatedLikes = updatedLikes.filter((id) => id !== userId); // Unlike
    } else {
      updatedLikes.push(userId); // Like
    }

    await databases.updateDocument(
      databaseId,
      collectionId,
      postId,
      { likes: updatedLikes }
    );

    return updatedLikes;
  } catch (error) {
    throw new Error(error);
  }
};

// export const addComment = async (postId, commentText, user, isVideo = true) => {
//   try {
//     const collectionId = isVideo
//       ? videoCollectionId
//       : imageCollectionId;

    
//     const post = await databases.getDocument(
//       databaseId,
//       collectionId,
//       postId
//     );

//     const newComment = {
//       user: user.username,
//       text: commentText,
//       avatar: user.avatar,
//     };

//     const updatedComments = [...(post.comments || []), newComment];
//     console.log(updatedComments)

//     await databases.updateDocument(
//       databaseId,
//       collectionId,
//       postId,
//       { comments: updatedComments }
//     );
   
//     return updatedComments;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export const addComment = async (postId, commentText, user, isVideo = true) => {
  try {
    const collectionId = isVideo
      ? videoCollectionId
      : imageCollectionId;

    // Fetch the existing post
    const post = await databases.getDocument(
      databaseId,
      collectionId,
      postId
    );

    // New comment as a JSON string (Appwrite does not allow objects)
    const newComment = JSON.stringify({
      user: user.username,
      text: commentText,
      avatar: user.avatar,
      createdAt: new Date().toISOString(), // Timestamp for sorting
    });

    // Ensure existing comments are valid JSON strings
    const updatedComments = [...(post.comments || []), newComment];

    console.log("Updated Comments (Before Saving):", updatedComments); // Debugging

    // Update document with new comments array (strings only)
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      postId,
      { comments: updatedComments }
    );

    console.log("Database Update Response:", response); // Debugging

    return updatedComments;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error(error);
  }
};



export const uploadImage = async (file) => {
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      file
    );

    // Generate a URL to view the image
    const fileUrl = storage.getFileView(storageId, uploadedFile.$id);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createPost = async (form) => {
  try {
    const imageUrl = await uploadImage(form.image);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        video: imageUrl,
        thumbnail: imageUrl,
        creator: form.userId,
        likes: [],
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};