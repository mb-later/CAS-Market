

Citizen.CreateThread(function()
    local pedCoords = CAS.PedCoords
    if CAS.Ped == nil then
       
        local pedHash = GetHashKey(CAS.PedHash) 
        RequestModel(pedHash)
        while not HasModelLoaded(pedHash) do
            Wait(1)
        end
        CAS.Ped = CreatePed(1, pedHash, pedCoords.x, pedCoords.y, pedCoords.z-0.98, pedCoords.a, false, false)

        SetPedDefaultComponentVariation(ped)
        SetPedRandomProps(ped)
        SetPedRandomComponentVariation(ped, true)
        TaskStartScenarioInPlace(ped, "WORLD_HUMAN_SMOKING", 0, true)
        FreezeEntityPosition(ped, true)
        SetEntityInvincible(ped, true)
        SetBlockingOfNonTemporaryEvents(ped, true)
    end
    while true do
        local sleep = 750
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        local distance = #(coords - vector3(pedCoords.x, pedCoords.y, pedCoords.z))
        if distance < CAS.DrawDistance then
            sleep = 0
            DrawText3D(pedCoords.x, pedCoords.y, pedCoords.z+0.90, "[E] "..CAS.DrawText)
            if IsControlJustPressed(0, 38) then
                CASFunctions.DisplayUI()
            end
        end
        Citizen.Wait(sleep)
    end
end)

CASFunctions = {
    DisplayUI = function()
        local Items = {}
        for i in pairs(CAS.Items) do
            Items[#Items+1] = {
                label = CAS.Items[i].label,
                price = CAS.Items[i].price,
                imageSrc = CAS.Items[i].imageSrc,
                key = i,
                type = CAS.Items[i].type
            }
        end
        SendNUIMessage({
            action = "market",
            items = Items
        })
        SetNuiFocus(true,true)
    end
}
    



RegisterNUICallback("EscapeFromJs", function()
    SetNuiFocus(false,false)
end)


RegisterNUICallback("CompleteOrder", function(data, cb)
    print("yes")
    if not data.item or not data.price then return end
    print("none")
    if CAS.Framework == "qb" then
        QBCore.Functions.TriggerCallback("cas-server:BuyProducts",function(_)
            if (_) then
                Notify(CAS.CompleteText)
            end
            cb(_)
        end, data)
    elseif CAS.Framework == "esx" then
        ESX.TriggerServerCallback("cas-server:BuyProducts",function(_)
            if (_) then
                Notify(CAS.CompleteText)
            end
            cb(_)
        end,data)
    end
end)


function DrawText3D(x, y, z, text)
    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry('STRING')
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x, y, z, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 370
    DrawRect(0.0, 0.0 + 0.0125, 0.017 + factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end
