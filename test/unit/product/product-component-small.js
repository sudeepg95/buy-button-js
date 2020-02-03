import Product from '../../../src/components/product';
import Checkout from '../../../src/components/checkout';
import Cart from '../../../src/components/cart';
import Template from '../../../src/template';
import Component from '../../../src/component';
import ProductView from '../../../src/views/product';
import ProductUpdater from '../../../src/updaters/product';
import windowUtils from '../../../src/utils/window-utils';
import ShopifyBuy from '../../../src/buybutton';
import shopFixture from '../../fixtures/shop-info';
import productFixture from '../../fixtures/product-fixture';
import * as normalizeConfig from '../../../src/utils/normalize-config';
import * as formatMoney from '../../../src/utils/money';
import * as browserFeatures from '../../../src/utils/detect-features';
import * as getUnitPriceBaseUnit from '../../../src/utils/unit-price';

const rootImageURI = 'https://cdn.shopify.com/s/files/1/0014/8583/2214/products/';

describe('Product Component class', () => {
  let product;

  describe('prototype methods', () => {
    let props;
    const config = {
      id: 123,
      node: document.getElementById('qunit-fixture'),
      options: {
        product: {
          viewData: {
            test: 'test string',
          },
        },
      },
    };
    const fetchData = {};
    const fetchHandleData = {};
    let testProductCopy;
    let configCopy;
    let trackSpy;
    let trackMethodStub;
    let closeModalSpy;
    let setActiveElSpy;
    let fetchInfoStub;
    let fetchStub;
    let fetchByHandleStub;

    beforeEach(() => {
      trackSpy = sinon.spy();
      trackMethodStub = sinon.stub().callsFake((fn) => {
        return function(...params) {
          fn(...params);
        };
      });
      closeModalSpy = sinon.spy();
      setActiveElSpy = sinon.spy();
      props = {
        client: ShopifyBuy.buildClient({
          domain: 'test.myshopify.com',
          storefrontAccessToken: 123,
        }),
        browserFeatures: {
          transition: true,
          animation: true,
          transform: true,
        },
        tracker: {
          trackMethod: trackMethodStub,
          track: trackSpy,
        },
        createCart() {
          return Promise.resolve(new Cart(config, {
            tracker: {
              trackMethod: (fn) => {
                return function(...params) {
                  fn(...params);
                };
              },
            },
          }));
        },
        closeModal: closeModalSpy,
        setActiveEl: setActiveElSpy,
      };
      configCopy = Object.assign({}, config);
      configCopy.node = document.createElement('div');
      configCopy.node.setAttribute('id', 'fixture');
      document.body.appendChild(configCopy.node);
      testProductCopy = Object.assign({}, productFixture);
      product = new Product(configCopy, props);
      fetchInfoStub = sinon.stub(props.client.shop, 'fetchInfo').resolves(shopFixture);
      fetchStub = sinon.stub(product.props.client.product, 'fetch').resolves(fetchData);
      fetchByHandleStub = sinon.stub(product.props.client.product, 'fetchByHandle').resolves(fetchHandleData);
    });

    afterEach(() => {
      fetchInfoStub.restore();
      fetchStub.restore();
      fetchByHandleStub.restore();
      // document.body.removeChild(configCopy.node);
    });

    describe('getters', () => {

      describe('viewData', () => {
        let viewData;

        beforeEach(async () => {
          await product.init(testProductCopy);
          viewData = product.viewData;
        });

        it('returns an object merged with model', () => {
          assert.equal(viewData.title, product.model.title);
          assert.equal(viewData.id, product.model.id);
          assert.equal(viewData.images, product.model.images);
          assert.equal(viewData.options, product.model.options);
          assert.equal(viewData.storeFrontId, product.model.storeFrontId);
          assert.equal(viewData.variants, product.model.variants);
        });

        it('returns an object merged with option\'s viewData', () => {
          assert.equal(viewData.test, product.options.viewData.test);
        });

        it('returns an object with classes', () => {
          assert.deepEqual(viewData.classes, product.classes);
        });

        it('returns an object with contents', () => {
          assert.deepEqual(viewData.contents, product.options.contents);
        });

        it('returns an object with text', () => {
          assert.deepEqual(viewData.text, product.options.text);
        });

        it('returns an object with optionsHtml', () => {
          assert.equal(viewData.optionsHtml, product.optionsHtml);
        });

        it('returns an object with decoratedOptions', () => {
          assert.deepEqual(viewData.decoratedOptions, product.decoratedOptions);
        });

        it('returns an object with currentImage', () => {
          assert.deepEqual(viewData.currentImage, product.currentImage);
        });

        it('returns an object with buttonClass', () => {
          assert.equal(viewData.buttonClass, product.buttonClass);
        });

        it('returns an object with hasVariants', () => {
          assert.equal(viewData.hasVariants, product.hasVariants);
        });

        it('returns an object with buttonDisabled', () => {
          assert.equal(viewData.buttonDisabled, !product.buttonEnabled);
        });

        it('returns an object with selectedVariant', () => {
          assert.equal(viewData.selectedVariant, product.selectedVariant);
        });

        it('returns an object with selectedQuantity', () => {
          assert.equal(viewData.selectedQuantity, product.selectedQuantity);
        });

        it('returns an object with buttonText', () => {
          assert.deepEqual(viewData.buttonText, product.buttonText);
        });

        it('returns an object with imgStyle', () => {
          assert.equal(viewData.imgStyle, product.imgStyle);
        });

        it('returns an object with quantityClass', () => {
          assert.equal(viewData.quantityClass, product.quantityClass);
        });

        it('returns an object with priceClass', () => {
          assert.equal(viewData.priceClass, product.priceClass);
        });

        it('returns an object with formattedPrice', () => {
          assert.equal(viewData.formattedPrice, product.formattedPrice);
        });

        it('returns an object with formattedCompareAtPrice', () => {
          assert.equal(viewData.formattedCompareAtPrice, product.formattedCompareAtPrice);
        });

        it('returns an object with carouslIndex', () => {
          assert.equal(viewData.carouselIndex, 0);
        });

        it('returns an object with carouselImages', () => {
          assert.deepEqual(viewData.carouselImages, product.carouselImages);
        });
      });
    });
  });
});
