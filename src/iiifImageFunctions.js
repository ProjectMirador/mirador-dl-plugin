function getArrayFromInfoResponse(imageInfo, key) {
  const value = imageInfo && imageInfo[key];
  let valueArray;
  if (Array.isArray(value)) {
    valueArray = value;
  } else if (typeof value === 'string') {
    valueArray = [value];
  }
  return valueArray;
}

export function getComplianceLevel(imageInfo) {
  const profile = getArrayFromInfoResponse(imageInfo, 'profile');
  switch (profile && profile[0]) {
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level0':
    case 'http://iiif.io/api/image/1/level0.json':
    case 'http://iiif.io/api/image/2/level0.json':
    case 'level0':
      return 0;
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level1':
    case 'http://iiif.io/api/image/1/level1.json':
    case 'http://iiif.io/api/image/2/level1.json':
    case 'level1':
      return 1;
    case 'http://library.stanford.edu/iiif/image-api/1.1/compliance.html#level2':
    case 'http://iiif.io/api/image/1/level2.json':
    case 'http://iiif.io/api/image/2/level2.json':
    case 'level2':
      return 2;
    default:
      return undefined;
  }
}

export function getImageApiVersion(imageInfo) {
  const context = getArrayFromInfoResponse(imageInfo, '@context');
  if (!context) {
    return undefined;
  }
  if (context.indexOf('http://iiif.io/api/image/3/context.json') > -1) {
    return 3;
  }
  if (context.indexOf('http://iiif.io/api/image/2/context.json') > -1) {
    return 2;
  }
  if (context.indexOf('http://iiif.io/api/image/1/context.json') > -1
    || context.indexOf('http://library.stanford.edu/iiif/image-api/1.1/context.json') > -1) {
    return 1;
  }
  return undefined;
}

function supportsAdditonalFeature(imageInfo, feature) {
  const version = getImageApiVersion(imageInfo);
  switch (version) {
    case 2: {
      const profile = getArrayFromInfoResponse(imageInfo, 'profile');
      return profile
        && profile.length > 1
        && profile[1].supports
        && profile[1].supports.indexOf(feature) > -1;
    }
    case 3:
      return imageInfo.extraFeatures && imageInfo.extraFeatures.indexOf(feature) > -1;
    default:
      return false;
  }
}

export function requestExceedsMaximum(imageInfo, width, height) {
  const version = getImageApiVersion(imageInfo);
  switch (version) {
    case 2: {
      const profile = getArrayFromInfoResponse(imageInfo, 'profile');
      return (profile.maxWidth && profile.maxWidth < width)
        || (profile.maxHeight && profile.maxHeight < height)
        || (profile.maxArea && profile.maxArea < width * height);
    }
    case 3: {
      return (imageInfo.maxWidth && imageInfo.maxWidth < width)
        || (imageInfo.maxHeight && imageInfo.maxHeight < height)
        || (imageInfo.maxArea && imageInfo.maxArea < width * height);
    }
    default:
      return false;
  }
}

function supportsArbitrarySizeInCanonicalForm(imageInfo) {
  const level = getComplianceLevel(imageInfo);
  const version = getImageApiVersion(imageInfo);
  // everything but undefined or 0 is fine
  if (!!level
    || (version < 3 && supportsAdditonalFeature(imageInfo, 'sizeByW'))
    || (version === 3 && supportsAdditonalFeature(imageInfo, 'sizeByWh'))) {
    return true;
  }
  return false;
}

function supportsRequest(imageInfo, region, width, height) {
  if (supportsArbitrarySizeInCanonicalForm(imageInfo)) {
    return true;
  }
  if (region === 'full') {
    return imageInfo.sizes
      && imageInfo.sizes.filter(
        (size) => size.width === width && size.height === height,
      ).length > 0;
  }
  return false;
}

export function calculateHeightForWidth(imageInfo, width) {
  if (!imageInfo) {
    return undefined;
  }
  if (imageInfo.width === width) {
    return imageInfo.width;
  }
  return Math.floor((imageInfo.height * width) / imageInfo.width);
}

export function createCanonicalImageUrl(imageInfo, region, width, height) {
  const version = getImageApiVersion(imageInfo);
  let baseUri = imageInfo['@id'] || imageInfo.id;
  baseUri = baseUri && baseUri.replace(/\/$/, '');
  let size = `${width},${version === 3 ? height : ''}`;
  const quality = version === 1 ? 'native' : 'default';
  if (version < 3 && imageInfo.width === width && imageInfo.height === height) {
    size = 'full';
  }
  if (!supportsArbitrarySizeInCanonicalForm(imageInfo)) {
    // TODO check if requested size is available for level 0, return undefined otherwise
  }
  if (requestExceedsMaximum(imageInfo, width, height)) {
    return undefined;
  }
  return `${baseUri}/${region}/${size}/0/${quality}.jpg`;
}
