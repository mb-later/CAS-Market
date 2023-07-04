if CAS.Framework == "qb" then
    QBCore = exports["qb-core"]:GetCoreObject()
else
    ESX = exports["es_extended"]:getSharedObject()
end



Notify = function(text)
    if CAS.Framework == "qb" then
        return QBCore.Functions.Notify(text)
    else
        return ESX.ShowNotification(text)
    end
end