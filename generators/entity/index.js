const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require(__dirname + '/../../package.json');
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
            this.log(chalk.white('Running ' + chalk.bold('JHipster hatch entitlements') + ' Generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
        },
        validate() {
            // this shouldn't be run directly
            if (!this.entityConfig) {
                this.env.error(chalk.red.bold('ERROR!') + ' This sub generator should be used only from JHipster and cannot be run directly...\n');
            }
        }
    },

    prompting() {
        // don't prompt if data are imported from a file
        if (this.entityConfig.useConfigurationFile == true && this.entityConfig.data && typeof this.entityConfig.data.yourOptionKey !== 'undefined') {
            this.yourOptionKey = this.entityConfig.data.yourOptionKey;
            return;
        }
        const done = this.async();
        const prompts = [
            {
                type: 'confirm',
                name: 'enableOption',
                message: 'Some option here?',
                default: false
            }
        ];

        this.prompt(prompts).then((props) => {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        });
    },

    writing: {
        updateFiles() {
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

            const entityName = this.entityConfig.entityClass;

            // do your stuff here
        },

        writeFiles() {
            // function to use directly template
            this.template = function (source, destination) {
                this.fs.copyTpl(
                    this.templatePath(source),
                    this.destinationPath(destination),
                    this
                );
            };

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


        },

        updateConfig() {
            this.updateEntityConfig(this.entityConfig.filename, 'yourOptionKey', this.yourOptionKey);
        }
    },

    end() {
        if (this.yourOptionKey){
            this.log('\n' + chalk.bold.green('hatch entitlements enabled'));
        }
    }
});
