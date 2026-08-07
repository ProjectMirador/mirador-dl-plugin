import { requestExceedsMaximum } from '../src/iiifImageFunctions';
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
