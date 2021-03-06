const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require('../../package.json');
const semver = require('semver');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);

module.exports = JhipsterGenerator.extend({
    initializing: {
        readConfig() {
            this.jhipsterAppConfig = this.getJhipsterAppConfig();
            if (!this.jhipsterAppConfig) {
                this.error('Can\'t read .yo-rc.json');
            }
        },
        displayLogo() {
            // it's here to show that you can use functions from generator-jhipster
            // this function is in: generator-jhipster/generators/generator-base.js
            this.printJHipsterLogo();

            // Have Yeoman greet the user.
            this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster hatch-entitlements')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        },
        checkJhipster() {
            const jhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
            const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
            if (!semver.satisfies(jhipsterVersion, minimumJhipsterVersion)) {
                this.warning(`\nYour generated project used an old JHipster version (${jhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
            }
        }
    },


    writing() {
        // function to use directly template
        this.template = function (source, destination) {
            this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
            );
        };

        // read config from .yo-rc.json
        this.baseName = this.jhipsterAppConfig.baseName;
        this.packageName = this.jhipsterAppConfig.packageName;
        this.packageFolder = this.jhipsterAppConfig.packageFolder;
        this.clientFramework = this.jhipsterAppConfig.clientFramework;
        this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
        this.buildTool = this.jhipsterAppConfig.buildTool;

        // use function in generator-base.js from generator-jhipster
        this.angularAppName = this.getAngularAppName();

        // use constants from generator-constants.js
        const javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
        const resourceDir = jhipsterConstants.SERVER_MAIN_RES_DIR;
        const webappDir = jhipsterConstants.CLIENT_MAIN_SRC_DIR;

        // show all variables
        this.log('\n--- some config read from config ---');
        this.log(`baseName=${this.baseName}`);
        this.log(`packageName=${this.packageName}`);
        this.log(`clientFramework=${this.clientFramework}`);
        this.log(`clientPackageManager=${this.clientPackageManager}`);
        this.log(`buildTool=${this.buildTool}`);

        this.log('\n--- some function ---');
        this.log(`angularAppName=${this.angularAppName}`);

        this.log('\n--- some const ---');
        this.log(`javaDir=${javaDir}`);
        this.log(`resourceDir=${resourceDir}`);
        this.log(`webappDir=${webappDir}`);

        this.log('\n--- variables from questions ---');
        this.log(`\nmessage=${this.message}`);
        this.log('------\n');

        if (this.clientFramework === 'angular1') {
        }
        if (this.clientFramework === 'angular2') {
        }
        if (this.buildTool === 'maven') {
        }
        if (this.buildTool === 'gradle') {
        }


        this.template('src/main/java/package/config/_HatchAuthorizationConfiguration.java', `${javaDir}config/HatchAuthorizationConfiguration.java`);

        this.template('src/main/java/package/security/entitlements/_HatchEntitlement.java', `${javaDir}security/entitlements/HatchEntitlement.java`);
        this.template('src/main/java/package/security/entitlements/_HatchEntitlementProvider.java', `${javaDir}security/entitlements/HatchEntitlementProvider.java`);
        this.template('src/main/java/package/security/entitlements/_HatchPermission.java', `${javaDir}security/entitlements/HatchPermission.java`);
        this.template('src/main/java/package/security/entitlements/custommethodsecurityexpression/_HatchEntitlementMethodSecurityExpressionHandler.java', `${javaDir}security/entitlements/custommethodsecurityexpression/HatchEntitlementMethodSecurityExpressionHandler.java`);
        this.template('src/main/java/package/security/entitlements/custommethodsecurityexpression/_HatchEntitlementMethodSecurityExpressionRoot.java', `${javaDir}security/entitlements/custommethodsecurityexpression/HatchEntitlementMethodSecurityExpressionRoot.java`);
        this.template('src/main/java/package/security/entitlements/inmemoryprovider/_HatchEntitlementsInMemoryProvider.java', `${javaDir}security/entitlements/inmemoryprovider/HatchEntitlementsInMemoryProvider.java`);
        this.template('src/main/java/package/security/entitlements/inmemoryprovider/_HatchEntitlementsInMemoryStore.java', `${javaDir}security/entitlements/inmemoryprovider/HatchEntitlementsInMemoryStore.java`);
        this.template('src/main/java/package/security/entitlements/inmemoryprovider/builder/_EntitlementsBuilder.java', `${javaDir}security/entitlements/inmemoryprovider/builder/EntitlementsBuilder.java`);
        this.template('src/main/java/package/security/entitlements/inmemoryprovider/builder/_PermissionBuilder.java', `${javaDir}security/entitlements/inmemoryprovider/builder/PermissionBuilder.java`);

        try {
            this.registerModule('generator-jhipster-hatch-entitlements', 'entity', 'post', 'app', 'Add support for entitlements');
        } catch (err) {
            this.log(`${chalk.red.bold('WARN!')} Could not register as a jhipster entity post creation hook...\n`);
        }
    },

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            this.installDependencies(installConfig);
        }
    },

    end() {
        this.log('End of hatch-entitlements generator');
    }
});


/*##### USAGE #####
To begin to work:
    - launch: yarn install
- link: yarn link
- test your module in a JHipster project:
    - go into your JHipster project
- link to your module: yarn link generator-jhipster-hatch-entitlements
- launch your module: yo jhipster-hatch-entitlements
- then, come back here, and begin to code!*/
