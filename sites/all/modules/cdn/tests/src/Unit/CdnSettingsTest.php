<?php

namespace Drupal\Tests\cdn\Unit;

use Drupal\cdn\CdnSettings;
use Drupal\Core\Config\ConfigValueException;
use Drupal\Tests\UnitTestCase;

/**
 * @coversDefaultClass \Drupal\cdn\CdnSettings
 * @group cdn
 */
class CdnSettingsTest extends UnitTestCase {

  /**
   * @covers ::getLookupTable
   * @covers ::getDomains
   * @dataProvider settingsProvider
   */
  public function test(array $raw_config, array $expected_lookup_table, array $expected_domains) {
    $cdn_settings = $this->createCdnSettings($raw_config);
    $this->assertTrue($cdn_settings->isEnabled());
    $this->assertSame($expected_lookup_table, $cdn_settings->getLookupTable());
    $this->assertSame(array_values($expected_domains), array_values($cdn_settings->getDomains()));
  }

  public function settingsProvider() {
    return [
      'simple, on, no conditions' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => 'cdn.example.com',
            'conditions' => [],
          ],
        ],
        ['*' => 'cdn.example.com'],
        ['cdn.example.com'],
      ],
      'simple, on, no conditions, IPv4 address + port' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => '127.0.0.1:8080',
            'conditions' => [],
          ],
        ],
        ['*' => '127.0.0.1:8080'],
        ['127.0.0.1:8080'],
      ],
      'simple, on, no conditions, IPv6 address + port' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80',
            'conditions' => [],
          ],
        ],
        ['*' => '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80'],
        ['[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80'],
      ],
      'simple, on, one empty condition' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => 'cdn.example.com',
            'conditions' => [
              'extensions' => [],
            ],
          ],
        ],
        ['*' => 'cdn.example.com'],
        ['cdn.example.com'],
      ],
      'simple, on, one condition' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => 'cdn.example.com',
            'conditions' => [
              'extensions' => ['jpg', 'jpeg', 'png'],
            ],
          ],
        ],
        [
          'jpg' => 'cdn.example.com',
          'jpeg' => 'cdn.example.com',
          'png' => 'cdn.example.com',
        ],
        ['cdn.example.com'],
      ],
      'simple, on, one negative condition' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'simple',
            'domain' => 'cdn.example.com',
            'conditions' => [
              'not' => [
                'extensions' => ['css', 'js'],
              ],
            ],
          ],
        ],
        [
          '*' => 'cdn.example.com',
          'css' => FALSE,
          'js' => FALSE,
        ],
        ['cdn.example.com'],
      ],
      'auto-balanced, on' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'auto-balanced',
            'domains' => [
              'img1.example.com',
              'img2.example.com',
            ],
            'conditions' => [
              'extensions' => ['jpg', 'png'],
            ],
          ],
        ],
        [
          'jpg' => ['img1.example.com', 'img2.example.com'],
          'png' => ['img1.example.com', 'img2.example.com'],
        ],
        ['img1.example.com', 'img2.example.com'],
      ],
      'complex containing two simple mappings, with fallback' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'complex',
            'fallback_domain' => '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:42',
            'domains' => [
              0 => [
                'type' => 'simple',
                'domain' => 'static.example.com',
                'conditions' => [
                  'extensions' => ['css', 'jpg', 'jpeg', 'png'],
                ],
              ],
              1 => [
                'type' => 'simple',
                'domain' => 'downloads.example.com',
                'conditions' => [
                  'extensions' => ['zip'],
                ],
              ],
            ],
          ],
        ],
        [
          '*' => '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:42',
          'css' => 'static.example.com',
          'jpg' => 'static.example.com',
          'jpeg' => 'static.example.com',
          'png' => 'static.example.com',
          'zip' => 'downloads.example.com',
        ],
        [
          '[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:42',
          'static.example.com',
          'downloads.example.com',
        ],
      ],
      'complex containing two simple mappings, without fallback' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'complex',
            'fallback_domain' => NULL,
            'domains' => [
              0 => [
                'type' => 'simple',
                'domain' => 'static.example.com',
                'conditions' => [
                  'extensions' => ['css', 'jpg', 'jpeg', 'png'],
                ],
              ],
              1 => [
                'type' => 'simple',
                'domain' => 'downloads.example.com',
                'conditions' => [
                  'extensions' => ['zip'],
                ],
              ],
            ],
          ],
        ],
        [
          'css' => 'static.example.com',
          'jpg' => 'static.example.com',
          'jpeg' => 'static.example.com',
          'png' => 'static.example.com',
          'zip' => 'downloads.example.com',
        ],
        ['static.example.com', 'downloads.example.com'],
      ],
      'complex containing one simple and one auto-balanced mapping, without fallback' => [
        [
          'status' => TRUE,
          'mapping' => [
            'type' => 'complex',
            'fallback_domain' => NULL,
            'domains' => [
              0 => [
                'type' => 'simple',
                'domain' => 'static.example.com',
                'conditions' => [
                  'extensions' => ['css', 'js'],
                ],
              ],
              1 => [
                'type' => 'auto-balanced',
                'domains' => [
                  'img1.example.com',
                  'img2.example.com',
                ],
                'conditions' => [
                  'extensions' => ['jpg', 'jpeg', 'png'],
                ],
              ],
            ],
          ],
        ],
        [
          'css' => 'static.example.com',
          'js' => 'static.example.com',
          'jpg' => ['img1.example.com', 'img2.example.com'],
          'jpeg' => ['img1.example.com', 'img2.example.com'],
          'png' => ['img1.example.com', 'img2.example.com'],
        ],
        ['static.example.com', 'img1.example.com', 'img2.example.com'],
      ],
    ];
  }

  /**
   * @covers ::getLookupTable
   */
  public function testSimpleMappingWithConditionsAndNegatedConditions() {
    $this->setExpectedException(\AssertionError::class, "It does not make sense to provide an 'extensions' condition as well as a negated 'extensions' condition.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'simple',
        'domain' => 'cdn.example.com',
        'conditions' => [
          'extensions' => ['foo', 'bar'],
          'not' => [
            'extensions' => ['baz', 'qux'],
          ],
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testComplexDomainWithNegatedConditions() {
    $this->setExpectedException(\AssertionError::class, "The nested mapping 1 includes negated conditions, which is not allowed for complex mappings: the fallback_domain already serves this purpose.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'complex',
        'fallback_domain' => 'cdn.example.com',
        'domains' => [
          0 => [
            'type' => 'simple',
            'domain' => 'foo.example.com',
            'conditions' => [
              'extensions' => ['png'],
            ],
          ],
          1 => [
            'type' => 'simple',
            'domain' => 'bar.example.com',
            'conditions' => [
              'not' => [
                'extensions' => ['png'],
              ],
            ],
          ],
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testAbsoluteUrlAsSimpleDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided domain http://cdn.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'simple',
        'domain' => 'http://cdn.example.com',
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testProtocolRelativeUrlAsSimpleDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided domain //cdn.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'simple',
        'domain' => '//cdn.example.com',
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testAbsoluteUrlAsComplexFallbackDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided fallback domain http://cdn.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'complex',
        'fallback_domain' => 'http://cdn.example.com',
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testProtocolRelativeUrlAsComplexFallbackDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided fallback domain //cdn.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'complex',
        'fallback_domain' => '//cdn.example.com',
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testAbsoluteUrlAsAutobalancedDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided domain http://foo.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'auto-balanced',
        'domains' => [
          'http://foo.example.com',
          'http://bar.example.com',
        ],
        'conditions' => [
          'extensions' => [
            'png',
          ],
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testProtocolRelativeUrlAsAutobalancedDomain() {
    $this->setExpectedException(\AssertionError::class, "The provided domain //foo.example.com is not valid. Provide a host like 'cdn.com' or 'cdn.example.com'. IP addresses and ports are also allowed.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'auto-balanced',
        'domains' => [
          '//foo.example.com',
          '//bar.example.com',
        ],
        'conditions' => [
          'extensions' => [
            'png',
          ],
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testAutobalancedWithoutConditions() {
    $this->setExpectedException(ConfigValueException::class, "It does not make sense to apply auto-balancing to all files, regardless of extension.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'auto-balanced',
        'fallback_domain' => NULL,
        'domains' => [
          'foo.example.com',
          'bar.example.com',
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * @covers ::getLookupTable
   */
  public function testComplexMappingWithoutConditions() {
    $this->setExpectedException(\AssertionError::class, "The nested mapping 0 includes no conditions, which is not allowed for complex mappings.");
    $this->createCdnSettings([
      'status' => TRUE,
      'mapping' => [
        'type' => 'complex',
        'fallback_domain' => 'cdn.example.com',
        'domains' => [
          0 => [
            'type' => 'simple',
            'domain' => 'foo.example.com',
          ],
        ],
      ],
    ])->getLookupTable();
  }

  /**
   * Creates a CdnSettings object from raw config.
   *
   * @param array $raw_config
   *   The raw config for the cdn.settings.yml config.
   *
   * @return \Drupal\cdn\CdnSettings
   *   The CdnSettings object to test.
   */
  protected function createCdnSettings(array $raw_config) {
    return new CdnSettings($this->getConfigFactoryStub(['cdn.settings' => $raw_config]));
  }

}
