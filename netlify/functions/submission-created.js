import fetch from 'node-fetch';

export const handler = async (event) => {
  const body = JSON.parse(event.body);
  const payload = body.payload;

  const siteName = payload.data['site-name'];
  const siteUrl = payload.data['site-url'];
  const siteDescription = payload.data['site-description'];
  const webringChoices = Array.isArray(payload.data.webring)
    ? payload.data.webring
    : [payload.data.webring];

  if (!siteName || !siteUrl || !webringChoices?.length) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'sickseeds';
  const REPO_NAME = 'webrings';
  const FILE_PATH = 'members.json';
  const BRANCH = 'main';

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const authHeader = `Bearer ${GITHUB_TOKEN}`;

  try {
    const getFileResponse = await fetch(url, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let currentMembers = { morute: [], traumacore: [] }; // Initialize with both keys
    let fileSha = null;

    if (getFileResponse.status === 200) {
      const fileData = await getFileResponse.json();
      fileSha = fileData.sha;
      const decodedContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
      currentMembers = JSON.parse(decodedContent);

      // Ensure both keys exist
      if (!currentMembers.morute) currentMembers.morute = [];
      if (!currentMembers.traumacore) currentMembers.traumacore = [];
    } else if (getFileResponse.status !== 404) {
      throw new Error(`Failed to fetch file: ${getFileResponse.statusText}`);
    }

    const newMember = {
      name: siteName,
      url: siteUrl,
      description: siteDescription || '',
      approved: false // Pending review
    };

    // Add to selected webrings (prevent duplicates)
    for (const webringChoice of webringChoices) {
      if (webringChoice === 'morute' || webringChoice === 'traumacore') {
        const exists = currentMembers[webringChoice].some(m => m.url === siteUrl);
        if (!exists) {
          currentMembers[webringChoice].push(newMember);
        }
      }
    }

    const updatedContentString = JSON.stringify(currentMembers, null, 2);
    const encodedContent = Buffer.from(updatedContentString).toString('base64');

    const updateFileResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `netlify-forms: add ${siteName}`,
        content: encodedContent,
        sha: fileSha,
        branch: BRANCH
      })
    });

    if (!updateFileResponse.ok) {
      const errorText = await updateFileResponse.text();
      throw new Error(`GitHub API error: ${errorText}`);
    }

    console.log(`Successfully added ${siteName} to members.json`);
    return { statusCode: 200, body: "Member added successfully! Pending approval." };

  } catch (error) {
    console.error("Error updating member list:", error);
    return { statusCode: 500, body: `Internal Server Error: ${error.message}` };
  }
};
