const CONTENTFUL_URL = 'https://cdn.contentful.com';
const ACCESS_TOKEN = '14761996571664b79ce7dd3aa5611568e612c9c48777b18a2ec1dc1ab51de7f6';
const SPACE_ID = '5eiffj9d03my';
const FULL_URL = `${CONTENTFUL_URL}/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&`;

const IS_SUCCESS = (status) => status >= 200 && status < 300;

function normalize (json) {
  const assets = json.includes.Asset;
  const items = json.items
    .map((item) => item.fields)
    .sort((a, b) => {
      if (a.index > b.index) {
        return 1;
      }

      return -1;
    })
    .map((proj) => {
      if (!proj.image) {
        return proj;
      }

      const foundImage = assets.find((asset) => {
        return proj.image.sys.id === asset.sys.id;
      });
      const foundThumb = assets.find((asset) => {
        return proj.thumb.sys.id === asset.sys.id;
      });

      proj.image = foundImage.fields.file.url;
      proj.thumb = foundThumb.fields.file.url;
      return proj;
    })

  console.log(items);

  return items;
}

// function normalizeDocuments (json) {
//   const assets = json.includes.Asset;

//   return json.items
//     .map((item) => item.fields)
//     .map((doc) => {
//       if (!doc.file) {
//         return doc;
//       }

//       const foundAsset = assets.find((asset) => {
//         return doc.file.sys.id === asset.sys.id;
//       });

//       doc.file = foundAsset.fields.file;
//       doc.link = foundAsset.fields.file.url;
//       return doc;
//     });
// }

// function normalizeHolidays (json) {
//   return json.items
//     .map((item) => item.fields)
//     .filter(shouldShowHoliday)
//     .sort((a, b) => {
//       if (isAfter(a.firstDay, b.firstDay)) {
//         return 1;
//       }

//       return -1;
//     });
// }

function validateResponse (response) {
  if (IS_SUCCESS) {
    return response.json();
  }

  return response.json()
    .then((json) => {
      throw json;
    });
}

export function getProjects () {
  return fetch(`${FULL_URL}content_type=projects&include=10`)
    .then(validateResponse)
    .then(normalize);
}

export default {
  getProjects
};