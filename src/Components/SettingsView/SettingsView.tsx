import { User } from '../../validators';

interface SettingsViewProps {
    loggedInUser: User;
}

const SettingsView = ({ loggedInUser }: SettingsViewProps) => {

    return (
        <>
            <div id='container' className="container mx-auto content-center">
                <h1 className="font-medium leading-tight text-5xl mt-0 mb-2 text-center">Settings</h1>

                <div className="flex items-center mb-4">
                    <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Email notifications enabled</label>
                </div>

            </div>
        </>
    )
}

export default SettingsView;
