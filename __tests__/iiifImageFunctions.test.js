import {
  calculateHeightForWidth,
  createCanonicalImageUrl,
  requestExceedsMaximum,
} from '../src/iiifImageFunctions';
import v2ImageInfo from './fixtures/imageInfoV2.json';
import v3ImageInfo from './fixtures/imageInfoV3.json';

const v2ImageInfoWithLimits = {
  ...v2ImageInfo,
  profile: [
    'http://iiif.io/api/image/2/level2.json',
    {
      maxWidth: 3000,
      maxHeight: 3500,
      maxArea: 8000000,
    },
  ],
};

const v3ImageInfoWithLimits = {
  ...v3ImageInfo,
  maxWidth: 3000,
  maxHeight: 3500,
  maxArea: 8000000,
};

describe('calculateHeightForWidth', () => {
  const imageInfo = { width: 1000, height: 1500 };

  it('returns undefined when there is no imageInfo', () => {
    expect(calculateHeightForWidth(undefined, 1000)).toBeUndefined();
  });

  it('returns the native height when the requested width is the native width', () => {
    expect(calculateHeightForWidth(imageInfo, 1000)).toBe(1500);
  });

  it('scales the height proportionally for a smaller width', () => {
    expect(calculateHeightForWidth(imageInfo, 500)).toBe(750);
  });

  it('scales the height proportionally for a larger width', () => {
    expect(calculateHeightForWidth(imageInfo, 2000)).toBe(3000);
  });

  it('floors fractional heights', () => {
    expect(calculateHeightForWidth({ width: 3, height: 10 }, 1)).toBe(3);
  });
});

const v2Level0ImageInfo = {
  '@context': 'http://iiif.io/api/image/2/context.json',
  '@id': 'https://example.org/iiif/level0',
  width: 4000,
  height: 5000,
  profile: ['http://iiif.io/api/image/2/level0.json'],
  sizes: [
    { width: 1000, height: 1250 },
    { width: 500, height: 625 },
  ],
};

const v3Level0ImageInfo = {
  '@context': 'http://iiif.io/api/image/3/context.json',
  id: 'https://example.org/iiif/3/level0',
  width: 4000,
  height: 5000,
  profile: 'level0',
  sizes: [{ width: 1000, height: 1250 }],
};

describe('createCanonicalImageUrl', () => {
  describe('level 0 image servers', () => {
    it('serves the whole image at its native size even when `sizes` omits it', () => {
      expect(createCanonicalImageUrl(v2Level0ImageInfo, 'full', 4000, 5000)).toBe(
        'https://example.org/iiif/level0/full/full/0/default.jpg',
      );
    });

    it('uses `max` for a native-size Image API 3 request', () => {
      expect(createCanonicalImageUrl(v3Level0ImageInfo, 'full', 4000, 5000)).toBe(
        'https://example.org/iiif/3/level0/full/max/0/default.jpg',
      );
    });

    it('serves a size that the server advertises in `sizes`', () => {
      expect(createCanonicalImageUrl(v2Level0ImageInfo, 'full', 1000, 1250)).toBe(
        'https://example.org/iiif/level0/full/1000,/0/default.jpg',
      );
    });

    it('returns undefined for a size the server does not advertise', () => {
      expect(createCanonicalImageUrl(v2Level0ImageInfo, 'full', 1234, 1543)).toBeUndefined();
    });

    it('returns undefined for a region other than the whole image', () => {
      expect(createCanonicalImageUrl(v2Level0ImageInfo, '0,0,100,100', 100, 100)).toBeUndefined();
    });

    it('returns undefined when the server advertises no sizes at all', () => {
      const noSizes = { ...v2Level0ImageInfo, sizes: undefined };
      expect(createCanonicalImageUrl(noSizes, 'full', 1000, 1250)).toBeUndefined();
    });
  });

  describe('IIIF Image API 2 (stacks.stanford.edu fixture)', () => {
    it('uses the `full` size keyword when the whole image is requested', () => {
      expect(createCanonicalImageUrl(v2ImageInfo, 'full', 4056, 5182)).toBe(
        'https://stacks.stanford.edu/image/iiif/fv114zn4386/LD3047_Q4_v090_1985_0001/full/full/0/default.jpg',
      );
    });

    it('uses `w,` for a scaled request', () => {
      expect(createCanonicalImageUrl(v2ImageInfo, 'full', 1000, 1277)).toBe(
        'https://stacks.stanford.edu/image/iiif/fv114zn4386/LD3047_Q4_v090_1985_0001/full/1000,/0/default.jpg',
      );
    });
  });

  describe('IIIF Image API 3 (ndhadeliver.natlib.govt.nz fixture)', () => {
    it('uses the `max` size keyword when the whole image is requested', () => {
      expect(createCanonicalImageUrl(v3ImageInfo, 'full', 4145, 5389)).toBe(
        'https://ndhadeliver.natlib.govt.nz/iiif/3/IE18987210:FL91807985.jp2/full/max/0/default.jpg',
      );
    });

    it('uses `w,h` for a scaled request', () => {
      expect(createCanonicalImageUrl(v3ImageInfo, 'full', 1000, 1300)).toBe(
        'https://ndhadeliver.natlib.govt.nz/iiif/3/IE18987210:FL91807985.jp2/full/1000,1300/0/default.jpg',
      );
    });
  });
});

describe('requestExceedsMaximum', () => {
  describe('IIIF Image API 2 (stacks.stanford.edu fixture)', () => {
    it('does not throw and returns false when the profile has no size limits', () => {
      expect(requestExceedsMaximum(v2ImageInfo, 8000, 8000)).toBe(false);
    });

    it('returns true when the requested area exceeds profile[1].maxArea', () => {
      expect(requestExceedsMaximum(v2ImageInfoWithLimits, 3000, 3000)).toBe(true);
    });

    it('returns true when the requested width exceeds profile[1].maxWidth', () => {
      expect(requestExceedsMaximum(v2ImageInfoWithLimits, 3500, 100)).toBe(true);
    });

    it('returns true when the requested height exceeds profile[1].maxHeight', () => {
      expect(requestExceedsMaximum(v2ImageInfoWithLimits, 100, 4000)).toBe(true);
    });

    it('returns false when the request is within all declared limits', () => {
      expect(requestExceedsMaximum(v2ImageInfoWithLimits, 1000, 1000)).toBe(false);
    });
  });

  describe('IIIF Image API 3 (ndhadeliver.natlib.govt.nz fixture)', () => {
    it('does not throw and returns false when the profile has no size limits', () => {
      expect(requestExceedsMaximum(v3ImageInfo, 8000, 8000)).toBe(false);
    });

    it('returns true when the requested area exceeds maxArea', () => {
      expect(requestExceedsMaximum(v3ImageInfoWithLimits, 3000, 3000)).toBe(true);
    });

    it('returns true when the requested width exceeds maxWidth', () => {
      expect(requestExceedsMaximum(v3ImageInfoWithLimits, 3500, 100)).toBe(true);
    });

    it('returns true when the requested height exceeds maxHeight', () => {
      expect(requestExceedsMaximum(v3ImageInfoWithLimits, 100, 4000)).toBe(true);
    });

    it('returns false when the request is within all declared limits', () => {
      expect(requestExceedsMaximum(v3ImageInfoWithLimits, 1000, 1000)).toBe(false);
    });
  });
});
